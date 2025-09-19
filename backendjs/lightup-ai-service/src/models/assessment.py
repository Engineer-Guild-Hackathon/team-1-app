"""Assessment-related data models."""

from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field, ConfigDict

from .common import BaseResponse, DifficultyLevel, KnowledgeNodeInfo


class QuestionType(str, Enum):
    """Types of assessment questions."""
    MULTIPLE_CHOICE = "multiple_choice"
    SHORT_ANSWER = "short_answer"
    TRUE_FALSE = "true_false"
    CODING = "coding"
    ESSAY = "essay"


class AssessmentGenerationRequest(BaseModel):
    """Request model for generating assessments."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_course_id": "course_123",
                "nodes": [
                    {
                        "id": "python-basics",
                        "title": "Python Basics",
                        "description": "Learn Python fundamentals",
                        "prerequisites": [],
                        "estimated_hours": 8.0,
                        "current_user_status": "next"
                    }
                ],
                "difficulty_level": "medium",
                "question_count": 6,
                "focus_areas": ["syntax", "variables"]
            }
        }
    )

    user_course_id: str = Field(..., description="User course identifier")
    nodes: List[KnowledgeNodeInfo] = Field(..., description="Knowledge nodes to assess")
    difficulty_level: DifficultyLevel = Field(default=DifficultyLevel.MEDIUM, description="Assessment difficulty")
    question_count: int = Field(default=6, ge=3, le=15, description="Number of questions to generate")
    focus_areas: Optional[List[str]] = Field(default=None, description="Specific areas to focus on")


class GeneratedQuestion(BaseModel):
    """A generated assessment question."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "q_123",
                "node_id": "python-basics",
                "question": "What is the correct way to define a variable in Python?",
                "question_type": "multiple_choice",
                "options": ["var x = 5", "x = 5", "int x = 5", "define x = 5"],
                "correct_answer": "x = 5",
                "points": 10,
                "difficulty": "easy",
                "explanation": "In Python, variables are created by assignment",
                "keywords": ["variable", "assignment", "syntax"]
            }
        }
    )

    id: str = Field(default_factory=lambda: f"q_{uuid4().hex[:8]}", description="Question ID")
    node_id: str = Field(..., description="Associated knowledge node ID")
    question: str = Field(..., description="The question text")
    question_type: QuestionType = Field(..., description="Type of question")
    options: Optional[List[str]] = Field(default=None, description="Multiple choice options")
    correct_answer: Optional[str] = Field(default=None, description="Correct answer for grading")
    points: int = Field(default=10, ge=1, le=100, description="Points for this question")
    difficulty: DifficultyLevel = Field(..., description="Question difficulty level")
    explanation: str = Field(..., description="Explanation of the correct answer")
    keywords: List[str] = Field(default_factory=list, description="Keywords for scoring")
    hints: Optional[List[str]] = Field(default=None, description="Optional hints for the question")


class EvaluationCriteria(BaseModel):
    """Criteria for evaluating assessment responses."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "scoring_method": "weighted",
                "partial_credit": True,
                "keyword_weights": {"syntax": 0.4, "variables": 0.6},
                "time_factor": 0.1
            }
        }
    )

    scoring_method: str = Field(default="weighted", description="Method for scoring responses")
    partial_credit: bool = Field(default=True, description="Whether to award partial credit")
    keyword_weights: Dict[str, float] = Field(default_factory=dict, description="Keyword importance weights")
    time_factor: float = Field(default=0.1, ge=0, le=1, description="Time taken factor in scoring")


class AssessmentResponse(BaseResponse):
    """Response model for generated assessments."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "assessment_123",
                "assessment_id": "assessment_123",
                "questions": [],
                "estimated_minutes": 20,
                "evaluation_criteria": {}
            }
        }
    )

    assessment_id: str = Field(..., description="Generated assessment ID")
    questions: List[GeneratedQuestion] = Field(..., description="Generated questions")
    estimated_minutes: int = Field(..., ge=5, description="Estimated completion time")
    evaluation_criteria: EvaluationCriteria = Field(..., description="Evaluation criteria")


class UserAnswer(BaseModel):
    """User's answer to an assessment question."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "question_id": "q_123",
                "answer": "x = 5",
                "time_taken_seconds": 30,
                "confidence_level": 0.8
            }
        }
    )

    question_id: str = Field(..., description="Question ID being answered")
    answer: str = Field(..., description="User's answer")
    time_taken_seconds: Optional[int] = Field(default=None, ge=0, description="Time taken to answer")
    confidence_level: Optional[float] = Field(default=None, ge=0, le=1, description="User's confidence")


class AssessmentEvaluationRequest(BaseModel):
    """Request model for evaluating assessment responses."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "assessment_id": "assessment_123",
                "answers": [
                    {
                        "question_id": "q_123",
                        "answer": "x = 5",
                        "time_taken_seconds": 30
                    }
                ]
            }
        }
    )

    assessment_id: str = Field(..., description="Assessment being evaluated")
    answers: List[UserAnswer] = Field(..., description="User's answers")


class QuestionScore(BaseModel):
    """Score for an individual question."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "question_id": "q_123",
                "score": 8.5,
                "max_score": 10,
                "feedback": "Good answer but could be more specific",
                "is_correct": True
            }
        }
    )

    question_id: str = Field(..., description="Question ID")
    score: float = Field(..., ge=0, description="Points earned")
    max_score: int = Field(..., ge=1, description="Maximum possible points")
    feedback: str = Field(..., description="Feedback on the answer")
    is_correct: bool = Field(..., description="Whether the answer is correct")


class NodeScore(BaseModel):
    """Score and feedback for a knowledge node."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "node_id": "python-basics",
                "score": 85,
                "feedback": "Good understanding of basic concepts",
                "recommended_action": "continue",
                "areas_to_improve": ["advanced syntax"]
            }
        }
    )

    node_id: str = Field(..., description="Knowledge node ID")
    score: int = Field(..., ge=0, le=100, description="Score for this node (0-100)")
    feedback: str = Field(..., description="Detailed feedback")
    recommended_action: str = Field(..., description="Recommended next action")
    areas_to_improve: List[str] = Field(default_factory=list, description="Areas needing improvement")


class AssessmentEvaluationResponse(BaseResponse):
    """Response model for assessment evaluation."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "eval_123",
                "total_score": 85,
                "max_score": 100,
                "percentage": 85.0,
                "question_scores": [],
                "node_scores": [],
                "overall_feedback": "Good performance overall",
                "study_recommendations": ["Review advanced concepts"]
            }
        }
    )

    total_score: float = Field(..., ge=0, description="Total points earned")
    max_score: int = Field(..., ge=1, description="Maximum possible points")
    percentage: float = Field(..., ge=0, le=100, description="Score as percentage")
    question_scores: List[QuestionScore] = Field(..., description="Individual question scores")
    node_scores: List[NodeScore] = Field(..., description="Scores by knowledge node")
    overall_feedback: str = Field(..., description="Overall performance feedback")
    study_recommendations: List[str] = Field(default_factory=list, description="Recommended study actions")