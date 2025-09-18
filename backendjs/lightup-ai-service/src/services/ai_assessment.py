"""AI-powered assessment generation and evaluation service."""

import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from uuid import uuid4

from src.models.assessment import (
    AssessmentGenerationRequest,
    AssessmentResponse,
    AssessmentEvaluationRequest,
    AssessmentEvaluationResponse,
    GeneratedQuestion,
    EvaluationCriteria,
    QuestionScore,
    NodeScore,
    UserAnswer
)
from src.services.llm_client import llm_client
from src.utils.prompt_templates import PromptTemplates
from src.config.settings import settings

logger = logging.getLogger(__name__)


class AIAssessmentService:
    """Service for AI-powered assessment generation and evaluation."""

    def __init__(self):
        """Initialize the assessment service."""
        self.question_cache = {}  # Simple in-memory cache
        self.evaluation_cache = {}

    async def generate_assessment(
        self,
        request: AssessmentGenerationRequest
    ) -> AssessmentResponse:
        """
        Generate an AI-powered assessment based on knowledge nodes.

        Args:
            request: Assessment generation request

        Returns:
            Generated assessment response
        """
        start_time = datetime.utcnow()

        try:
            logger.info(
                "Starting assessment generation",
                extra={
                    "user_course_id": request.user_course_id,
                    "node_count": len(request.nodes),
                    "difficulty": request.difficulty_level,
                    "question_count": request.question_count
                }
            )

            # Create cache key
            cache_key = self._create_cache_key(request)

            # Check cache first
            if cache_key in self.question_cache:
                logger.info("Returning cached assessment")
                return self.question_cache[cache_key]

            # Generate user progress data for context
            user_progress = self._extract_user_progress(request.nodes)

            # Create the prompt
            prompt = PromptTemplates.assessment_generation_prompt(
                nodes=request.nodes,
                user_progress=user_progress,
                difficulty_level=request.difficulty_level.value,
                question_count=request.question_count,
                focus_areas=request.focus_areas
            )

            # Define expected JSON schema
            expected_schema = {
                "type": "object",
                "required": ["questions", "estimated_minutes"],
                "properties": {
                    "questions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["id", "node_id", "question", "question_type", "points", "difficulty", "explanation", "keywords"],
                            "properties": {
                                "id": {"type": "string"},
                                "node_id": {"type": "string"},
                                "question": {"type": "string"},
                                "question_type": {"type": "string"},
                                "options": {"type": "array"},
                                "correct_answer": {"type": "string"},
                                "points": {"type": "integer"},
                                "difficulty": {"type": "string"},
                                "explanation": {"type": "string"},
                                "keywords": {"type": "array"}
                            }
                        }
                    },
                    "estimated_minutes": {"type": "integer"}
                }
            }

            # Generate assessment using LLM
            ai_response = await llm_client.generate_json_completion(
                prompt=prompt,
                expected_schema=expected_schema,
                max_tokens=4000,
                temperature=0.7
            )

            # Process and validate the response
            questions = self._process_generated_questions(ai_response["questions"], request.nodes)
            estimated_minutes = ai_response.get("estimated_minutes", len(questions) * 3)

            # Create evaluation criteria
            evaluation_criteria = EvaluationCriteria(
                scoring_method="weighted",
                partial_credit=True,
                keyword_weights=self._calculate_keyword_weights(questions),
                time_factor=0.1
            )

            # Create response
            assessment_id = str(uuid4())
            response = AssessmentResponse(
                id=assessment_id,
                assessment_id=assessment_id,
                questions=questions,
                estimated_minutes=max(10, estimated_minutes),
                evaluation_criteria=evaluation_criteria,
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )

            # Cache the result
            self.question_cache[cache_key] = response

            logger.info(
                "Assessment generation completed",
                extra={
                    "assessment_id": assessment_id,
                    "question_count": len(questions),
                    "estimated_minutes": estimated_minutes,
                    "processing_time": response.processing_time_seconds
                }
            )

            return response

        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                "Assessment generation failed",
                extra={
                    "error": str(e),
                    "processing_time": processing_time,
                    "user_course_id": request.user_course_id
                }
            )
            raise

    async def evaluate_assessment(
        self,
        request: AssessmentEvaluationRequest,
        original_questions: List[GeneratedQuestion]
    ) -> AssessmentEvaluationResponse:
        """
        Evaluate user answers using AI.

        Args:
            request: Evaluation request with user answers
            original_questions: Original generated questions

        Returns:
            Evaluation response with scores and feedback
        """
        start_time = datetime.utcnow()

        try:
            logger.info(
                "Starting assessment evaluation",
                extra={
                    "assessment_id": request.assessment_id,
                    "answer_count": len(request.answers)
                }
            )

            # Create cache key for evaluation
            cache_key = f"eval_{request.assessment_id}_{hash(str(sorted([(a.question_id, a.answer) for a in request.answers])))}"

            if cache_key in self.evaluation_cache:
                logger.info("Returning cached evaluation")
                return self.evaluation_cache[cache_key]

            # Prepare questions and answers for evaluation
            questions_dict = {q.id: q for q in original_questions}
            evaluation_data = []

            for question in original_questions:
                user_answer = next(
                    (ans for ans in request.answers if ans.question_id == question.id),
                    None
                )
                evaluation_data.append({
                    "id": question.id,
                    "node_id": question.node_id,
                    "question": question.question,
                    "question_type": question.question_type,
                    "correct_answer": question.correct_answer,
                    "points": question.points,
                    "keywords": question.keywords,
                    "user_answer": user_answer.answer if user_answer else "Not answered"
                })

            # Generate evaluation prompt
            prompt = PromptTemplates.assessment_evaluation_prompt(
                questions=evaluation_data,
                user_answers=[{
                    "question_id": ans.question_id,
                    "answer": ans.answer,
                    "time_taken": getattr(ans, 'time_taken_seconds', None)
                } for ans in request.answers]
            )

            # Define evaluation schema
            evaluation_schema = {
                "type": "object",
                "required": ["question_scores", "node_scores", "total_score", "max_score", "percentage", "overall_feedback"],
                "properties": {
                    "question_scores": {"type": "array"},
                    "node_scores": {"type": "array"},
                    "total_score": {"type": "number"},
                    "max_score": {"type": "integer"},
                    "percentage": {"type": "number"},
                    "overall_feedback": {"type": "string"},
                    "study_recommendations": {"type": "array"}
                }
            }

            # Get AI evaluation
            ai_evaluation = await llm_client.generate_json_completion(
                prompt=prompt,
                expected_schema=evaluation_schema,
                max_tokens=3000,
                temperature=0.3  # Lower temperature for more consistent scoring
            )

            # Process the evaluation results
            question_scores = [
                QuestionScore(**score) for score in ai_evaluation["question_scores"]
            ]

            node_scores = [
                NodeScore(**score) for score in ai_evaluation["node_scores"]
            ]

            # Create evaluation response
            evaluation_id = str(uuid4())
            response = AssessmentEvaluationResponse(
                id=evaluation_id,
                total_score=ai_evaluation["total_score"],
                max_score=ai_evaluation["max_score"],
                percentage=ai_evaluation["percentage"],
                question_scores=question_scores,
                node_scores=node_scores,
                overall_feedback=ai_evaluation["overall_feedback"],
                study_recommendations=ai_evaluation.get("study_recommendations", []),
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )

            # Cache the result
            self.evaluation_cache[cache_key] = response

            logger.info(
                "Assessment evaluation completed",
                extra={
                    "evaluation_id": evaluation_id,
                    "total_score": response.total_score,
                    "percentage": response.percentage,
                    "processing_time": response.processing_time_seconds
                }
            )

            return response

        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                "Assessment evaluation failed",
                extra={
                    "error": str(e),
                    "processing_time": processing_time,
                    "assessment_id": request.assessment_id
                }
            )
            raise

    def _create_cache_key(self, request: AssessmentGenerationRequest) -> str:
        """Create a cache key for assessment generation."""
        node_ids = sorted([node.id for node in request.nodes])
        focus_areas = sorted(request.focus_areas or [])

        return f"assess_{hash(str(node_ids))}_{request.difficulty_level.value}_{request.question_count}_{hash(str(focus_areas))}"

    def _extract_user_progress(self, nodes: List[Any]) -> List[Dict[str, Any]]:
        """Extract user progress from nodes for prompt context."""
        progress = []

        for node in nodes:
            progress.append({
                "node_id": node.id,
                "status": node.current_user_status,
                "mastery_score": 0,  # Default, would be updated from actual progress
                "study_time_minutes": 0
            })

        return progress

    def _process_generated_questions(
        self,
        raw_questions: List[Dict[str, Any]],
        nodes: List[Any]
    ) -> List[GeneratedQuestion]:
        """Process and validate generated questions."""
        questions = []
        node_ids = {node.id for node in nodes}

        for i, q in enumerate(raw_questions):
            try:
                # Validate node_id exists
                if q.get("node_id") not in node_ids:
                    logger.warning(f"Question {i} references invalid node_id: {q.get('node_id')}")
                    continue

                # Set default values and validate
                question = GeneratedQuestion(
                    id=q.get("id", f"q_{uuid4().hex[:8]}"),
                    node_id=q["node_id"],
                    question=q["question"],
                    question_type=q["question_type"],
                    options=q.get("options"),
                    correct_answer=q.get("correct_answer"),
                    points=q.get("points", 10),
                    difficulty=q.get("difficulty", "medium"),
                    explanation=q.get("explanation", ""),
                    keywords=q.get("keywords", []),
                    hints=q.get("hints")
                )

                questions.append(question)

            except Exception as e:
                logger.warning(f"Failed to process question {i}: {e}")
                continue

        return questions

    def _calculate_keyword_weights(self, questions: List[GeneratedQuestion]) -> Dict[str, float]:
        """Calculate keyword weights for evaluation."""
        keyword_counts = {}
        total_keywords = 0

        for question in questions:
            for keyword in question.keywords:
                keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
                total_keywords += 1

        if total_keywords == 0:
            return {}

        # Convert counts to weights (inverse frequency)
        weights = {}
        for keyword, count in keyword_counts.items():
            weights[keyword] = 1.0 / count

        return weights

    async def get_assessment_analytics(
        self,
        assessment_id: str,
        evaluations: List[AssessmentEvaluationResponse]
    ) -> Dict[str, Any]:
        """
        Generate analytics for an assessment based on multiple evaluations.

        Args:
            assessment_id: Assessment ID
            evaluations: List of evaluation responses

        Returns:
            Analytics data
        """
        if not evaluations:
            return {"error": "No evaluations provided"}

        try:
            # Calculate statistics
            scores = [eval_resp.percentage for eval_resp in evaluations]
            avg_score = sum(scores) / len(scores)

            # Question difficulty analysis
            question_stats = {}
            for evaluation in evaluations:
                for q_score in evaluation.question_scores:
                    if q_score.question_id not in question_stats:
                        question_stats[q_score.question_id] = {
                            "scores": [],
                            "correct_count": 0,
                            "total_count": 0
                        }

                    question_stats[q_score.question_id]["scores"].append(
                        q_score.score / q_score.max_score * 100
                    )
                    question_stats[q_score.question_id]["total_count"] += 1
                    if q_score.is_correct:
                        question_stats[q_score.question_id]["correct_count"] += 1

            # Calculate question difficulty
            question_difficulty = {}
            for q_id, stats in question_stats.items():
                avg_score = sum(stats["scores"]) / len(stats["scores"])
                correct_rate = stats["correct_count"] / stats["total_count"]

                question_difficulty[q_id] = {
                    "average_score": avg_score,
                    "correct_rate": correct_rate,
                    "difficulty_level": "easy" if correct_rate > 0.8 else "hard" if correct_rate < 0.5 else "medium"
                }

            return {
                "assessment_id": assessment_id,
                "evaluation_count": len(evaluations),
                "average_score": avg_score,
                "score_distribution": {
                    "min": min(scores),
                    "max": max(scores),
                    "median": sorted(scores)[len(scores) // 2]
                },
                "question_difficulty": question_difficulty,
                "generated_at": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Failed to generate analytics: {e}")
            return {"error": str(e)}

    def clear_cache(self) -> Dict[str, int]:
        """Clear assessment caches and return stats."""
        question_count = len(self.question_cache)
        evaluation_count = len(self.evaluation_cache)

        self.question_cache.clear()
        self.evaluation_cache.clear()

        return {
            "cleared_questions": question_count,
            "cleared_evaluations": evaluation_count
        }


# Global assessment service instance
ai_assessment_service = AIAssessmentService()