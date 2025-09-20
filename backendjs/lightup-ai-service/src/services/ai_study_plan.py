"""AI-powered study plan generation and adjustment service."""

import json
import logging
from datetime import datetime, date, timedelta
from typing import Dict, List, Any, Optional
from uuid import uuid4

from src.models.study_plan import (
    StudyPlanRequest,
    StudyPlanResponse,
    StudyPlanAdjustmentRequest,
    StudyPlanAdjustmentResponse,
    DailyStudyPlan,
    StudyActivity,
    PlanSummary,
    TimeConstraints,
    StudyPreferences
)
from src.models.common import ActivityType, Priority, KnowledgeNodeInfo, NodeProgress
from src.services.llm_client import llm_client
from src.utils.prompt_templates import PromptTemplates
from src.utils.time_calculator import TimeCalculator
from src.utils.graph_analyzer import GraphAnalyzer
from src.config.settings import settings

logger = logging.getLogger(__name__)


class AIStudyPlanService:
    """Service for AI-powered study plan generation and management."""

    def __init__(self):
        """Initialize the study plan service."""
        self.plan_cache = {}  # Simple in-memory cache for plans
        self.color_themes = [
            "#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336",
            "#009688", "#795548", "#607D8B", "#E91E63", "#3F51B5"
        ]

    async def generate_study_plan(
        self,
        request: StudyPlanRequest
    ) -> StudyPlanResponse:
        """
        Generate an AI-powered personalized study plan.

        Args:
            request: Study plan generation request

        Returns:
            Generated study plan response
        """
        start_time = datetime.utcnow()

        try:
            logger.info(
                "Starting study plan generation",
                extra={
                    "user_course_id": request.user_course_id,
                    "target_days": request.time_constraints.target_days,
                    "daily_hours": request.time_constraints.daily_hours,
                    "node_count": len(request.roadmap.nodes)
                }
            )

            # Validate and preprocess the request
            self._validate_study_plan_request(request)

            # Analyze current progress and requirements
            analysis = self._analyze_learning_requirements(request)

            # Check if plan is realistic
            realism_check = TimeCalculator.estimate_realistic_completion(
                target_days=request.time_constraints.target_days,
                daily_hours=request.time_constraints.daily_hours,
                total_required_hours=analysis["total_hours_needed"],
                buffer_factor=1.2
            )

            # Generate study days
            study_days = TimeCalculator.calculate_available_study_days(
                start_date=request.time_constraints.start_date or date.today().strftime("%Y-%m-%d"),
                target_days=realism_check["recommended_days"],
                exclude_weekends=request.time_constraints.exclude_weekends
            )

            # Create optimized learning sequence
            learning_sequence = self._create_learning_sequence(
                nodes=request.roadmap.nodes,
                edges=request.roadmap.edges,
                user_progress=request.user_progress
            )

            # Generate the initial plan structure using AI
            ai_plan = await self._generate_ai_plan(request, analysis, study_days, learning_sequence)

            # Optimize the plan with time calculations
            optimized_plan = self._optimize_plan_timing(
                ai_plan=ai_plan,
                study_days=study_days,
                daily_hours=realism_check["recommended_daily_hours"],
                preferences=request.preferences
            )

            # Create the final response
            plan_id = str(uuid4())
            summary = self._create_plan_summary(
                optimized_plan,
                study_days,
                realism_check,
                request.roadmap.nodes
            )

            # Generate recommendations
            recommendations = self._generate_recommendations(
                request,
                realism_check,
                analysis
            )

            response = StudyPlanResponse(
                id=plan_id,
                plan_id=plan_id,
                daily_schedule=optimized_plan,
                summary=summary,
                recommendations=recommendations,
                adaptability_score=self._calculate_adaptability_score(request, realism_check),
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )

            # Cache the plan
            self.plan_cache[plan_id] = response

            logger.info(
                "Study plan generation completed",
                extra={
                    "plan_id": plan_id,
                    "total_days": len(optimized_plan),
                    "total_hours": summary.total_hours,
                    "processing_time": response.processing_time_seconds
                }
            )

            return response

        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                "Study plan generation failed",
                extra={
                    "error": str(e),
                    "processing_time": processing_time,
                    "user_course_id": request.user_course_id
                }
            )
            raise

    async def adjust_study_plan(
        self,
        request: StudyPlanAdjustmentRequest
    ) -> StudyPlanAdjustmentResponse:
        """
        Adjust an existing study plan based on user feedback.

        Args:
            request: Plan adjustment request

        Returns:
            Adjusted study plan response
        """
        start_time = datetime.utcnow()

        try:
            logger.info(
                "Starting study plan adjustment",
                extra={
                    "plan_id": request.plan_id,
                    "completed_days": len(request.feedback.completed_days),
                    "remaining_days": request.remaining_days
                }
            )

            # Get original plan
            original_plan = self.plan_cache.get(request.plan_id)
            if not original_plan:
                raise ValueError(f"Original plan {request.plan_id} not found")

            # Analyze feedback and progress
            feedback_analysis = self._analyze_feedback(request.feedback, original_plan)

            # Create adjustment prompt
            prompt = PromptTemplates.plan_adjustment_prompt(
                original_plan=original_plan.model_dump(),
                feedback=request.feedback.model_dump(),
                remaining_days=request.remaining_days
            )

            # Generate AI adjustment
            adjustment_schema = {
                "type": "object",
                "required": ["adjusted_plan_id", "changes_made", "updated_schedule", "impact_analysis"],
                "properties": {
                    "adjusted_plan_id": {"type": "string"},
                    "changes_made": {"type": "array"},
                    "updated_schedule": {"type": "array"},
                    "impact_analysis": {"type": "string"}
                }
            }

            ai_adjustment = await llm_client.generate_json_completion(
                prompt=prompt,
                expected_schema=adjustment_schema,
                max_tokens=4000,
                temperature=0.5
            )

            # Process the adjusted schedule
            updated_schedule = [
                self._process_daily_plan(day_data, i + 1)
                for i, day_data in enumerate(ai_adjustment["updated_schedule"])
            ]

            # Create response
            adjustment_id = str(uuid4())
            adjusted_plan_id = f"{request.plan_id}_v{len(request.feedback.completed_days) + 1}"

            response = StudyPlanAdjustmentResponse(
                id=adjustment_id,
                adjusted_plan_id=adjusted_plan_id,
                changes_made=ai_adjustment["changes_made"],
                updated_schedule=updated_schedule,
                impact_analysis=ai_adjustment["impact_analysis"],
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )

            # Update cache with adjusted plan
            adjusted_plan = StudyPlanResponse(
                id=adjusted_plan_id,
                plan_id=adjusted_plan_id,
                daily_schedule=updated_schedule,
                summary=original_plan.summary,  # Would be recalculated in production
                recommendations=original_plan.recommendations,
                adaptability_score=original_plan.adaptability_score
            )
            self.plan_cache[adjusted_plan_id] = adjusted_plan

            logger.info(
                "Study plan adjustment completed",
                extra={
                    "adjustment_id": adjustment_id,
                    "adjusted_plan_id": adjusted_plan_id,
                    "changes_count": len(ai_adjustment["changes_made"]),
                    "processing_time": response.processing_time_seconds
                }
            )

            return response

        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                "Study plan adjustment failed",
                extra={
                    "error": str(e),
                    "processing_time": processing_time,
                    "plan_id": request.plan_id
                }
            )
            raise

    def _validate_study_plan_request(self, request: StudyPlanRequest) -> None:
        """Validate the study plan request."""
        if not request.roadmap.nodes:
            raise ValueError("Roadmap must contain at least one node")

        if request.time_constraints.target_days < 1:
            raise ValueError("Target days must be at least 1")

        if request.time_constraints.daily_hours < 0.5:
            raise ValueError("Daily hours must be at least 0.5")

        if request.time_constraints.daily_hours > 12:
            raise ValueError("Daily hours cannot exceed 12")

    def _analyze_learning_requirements(self, request: StudyPlanRequest) -> Dict[str, Any]:
        """Analyze learning requirements and current progress."""
        progress_lookup = {p.node_id: p for p in request.user_progress}

        total_hours_needed = 0
        completed_hours = 0
        review_hours = 0
        remaining_nodes = []

        for node in request.roadmap.nodes:
            progress = progress_lookup.get(node.id)

            if not progress or progress.status == "not_started":
                total_hours_needed += node.estimated_hours
                remaining_nodes.append(node.id)
            elif progress.status == "next":
                # Assume 30% progress
                remaining_time = node.estimated_hours * 0.7
                total_hours_needed += remaining_time
                remaining_nodes.append(node.id)
            elif progress.status == "needs_review":
                review_time = node.estimated_hours * 0.3
                total_hours_needed += review_time
                review_hours += review_time
                remaining_nodes.append(node.id)
            elif progress.status == "completed":
                completed_hours += node.estimated_hours

        return {
            "total_hours_needed": total_hours_needed,
            "completed_hours": completed_hours,
            "review_hours": review_hours,
            "remaining_nodes": remaining_nodes,
            "completion_percentage": completed_hours / (completed_hours + total_hours_needed) if (completed_hours + total_hours_needed) > 0 else 0
        }

    def _create_learning_sequence(
        self,
        nodes: List[KnowledgeNodeInfo],
        edges: List[Any],
        user_progress: List[NodeProgress]
    ) -> List[str]:
        """Create an optimal learning sequence."""
        return GraphAnalyzer.suggest_optimal_sequence(
            nodes=nodes,
            edges=edges,
            user_progress=user_progress,
            daily_hours=2.0  # Default for sequencing
        )

    async def _generate_ai_plan(
        self,
        request: StudyPlanRequest,
        analysis: Dict[str, Any],
        study_days: List[str],
        learning_sequence: List[str]
    ) -> List[Dict[str, Any]]:
        """Generate the initial plan structure using AI."""
        # Prepare course info
        course_info = {
            "total_nodes": len(request.roadmap.nodes),
            "completion_percentage": analysis["completion_percentage"],
            "remaining_hours": analysis["total_hours_needed"]
        }

        # Create prompt
        prompt = PromptTemplates.study_plan_generation_prompt(
            course_info=course_info,
            roadmap_data=request.roadmap.model_dump(),
            user_progress=request.user_progress,
            target_days=len(study_days),
            daily_hours=request.time_constraints.daily_hours,
            start_date=study_days[0] if study_days else None,
            preferences=request.preferences.model_dump() if request.preferences else None
        )

        # Generate plan
        plan_schema = {
            "type": "object",
            "required": ["daily_schedule"],
            "properties": {
                "daily_schedule": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": ["day", "date", "total_study_minutes", "activities", "daily_goal"],
                        "properties": {
                            "day": {"type": "integer"},
                            "date": {"type": "string"},
                            "total_study_minutes": {"type": "integer"},
                            "activities": {"type": "array"},
                            "daily_goal": {"type": "string"},
                            "color_theme": {"type": "string"},
                            "milestones": {"type": "array"}
                        }
                    }
                }
            }
        }

        ai_response = await llm_client.generate_json_completion(
            prompt=prompt,
            expected_schema=plan_schema,
            max_tokens=4000,
            temperature=0.6
        )

        return ai_response["daily_schedule"]

    def _optimize_plan_timing(
        self,
        ai_plan: List[Dict[str, Any]],
        study_days: List[str],
        daily_hours: float,
        preferences: Optional[StudyPreferences]
    ) -> List[DailyStudyPlan]:
        """Optimize the AI-generated plan with proper timing."""
        optimized_plans = []

        for i, day_data in enumerate(ai_plan):
            if i >= len(study_days):
                break

            # Ensure we have a date
            plan_date = study_days[i]

            # Process activities
            activities = []
            total_minutes = 0

            for activity_data in day_data.get("activities", []):
                try:
                    activity = StudyActivity(
                        node_id=activity_data["node_id"],
                        activity_type=ActivityType(activity_data.get("activity_type", "learn")),
                        estimated_minutes=activity_data.get("estimated_minutes", 60),
                        description=activity_data.get("description", ""),
                        priority=Priority(activity_data.get("priority", "medium")),
                        resources=activity_data.get("resources", [])
                    )
                    activities.append(activity)
                    total_minutes += activity.estimated_minutes
                except Exception as e:
                    logger.warning(f"Failed to process activity: {e}")
                    continue

            # Assign color theme
            color_theme = day_data.get("color_theme", self.color_themes[i % len(self.color_themes)])

            daily_plan = DailyStudyPlan(
                day=i + 1,
                date=plan_date,
                total_study_minutes=min(total_minutes, int(daily_hours * 60)),
                activities=activities,
                daily_goal=day_data.get("daily_goal", f"Study day {i + 1}"),
                color_theme=color_theme,
                milestones=day_data.get("milestones", [])
            )

            optimized_plans.append(daily_plan)

        return optimized_plans

    def _process_daily_plan(self, day_data: Dict[str, Any], day_number: int) -> DailyStudyPlan:
        """Process a single daily plan from AI response."""
        activities = []

        for activity_data in day_data.get("activities", []):
            try:
                activity = StudyActivity(
                    node_id=activity_data["node_id"],
                    activity_type=ActivityType(activity_data.get("activity_type", "learn")),
                    estimated_minutes=activity_data.get("estimated_minutes", 60),
                    description=activity_data.get("description", ""),
                    priority=Priority(activity_data.get("priority", "medium")),
                    resources=activity_data.get("resources", [])
                )
                activities.append(activity)
            except Exception as e:
                logger.warning(f"Failed to process activity: {e}")
                continue

        return DailyStudyPlan(
            day=day_number,
            date=day_data.get("date", date.today().strftime("%Y-%m-%d")),
            total_study_minutes=day_data.get("total_study_minutes", 120),
            activities=activities,
            daily_goal=day_data.get("daily_goal", f"Study day {day_number}"),
            color_theme=day_data.get("color_theme", self.color_themes[day_number % len(self.color_themes)]),
            milestones=day_data.get("milestones", [])
        )

    def _create_plan_summary(
        self,
        daily_plans: List[DailyStudyPlan],
        study_days: List[str],
        realism_check: Dict[str, Any],
        nodes: List[KnowledgeNodeInfo]
    ) -> PlanSummary:
        """Create plan summary."""
        total_hours = sum(plan.total_study_minutes for plan in daily_plans) / 60

        # Calculate difficulty distribution
        difficulty_dist = {"easy": 0, "medium": 0, "hard": 0}
        for node in nodes:
            difficulty = getattr(node, 'difficulty', 'medium')
            if difficulty in difficulty_dist:
                difficulty_dist[difficulty] += 1

        # Calculate weekly breakdown
        weekly_breakdown = TimeCalculator.calculate_weekly_breakdown(
            schedule={plan.date: {"total": plan.total_study_minutes / 60} for plan in daily_plans},
            start_date=study_days[0] if study_days else date.today().strftime("%Y-%m-%d")
        )

        return PlanSummary(
            total_days=len(daily_plans),
            total_hours=total_hours,
            nodes_to_complete=len(nodes),
            estimated_completion_date=study_days[-1] if study_days else date.today().strftime("%Y-%m-%d"),
            difficulty_distribution=difficulty_dist,
            weekly_breakdown=weekly_breakdown
        )

    def _generate_recommendations(
        self,
        request: StudyPlanRequest,
        realism_check: Dict[str, Any],
        analysis: Dict[str, Any]
    ) -> List[str]:
        """Generate study recommendations."""
        recommendations = []

        # Time-based recommendations
        if request.time_constraints.daily_hours > 4:
            recommendations.append("Take regular breaks every 25-30 minutes to maintain focus")
            recommendations.append("Consider splitting study sessions throughout the day")

        if not realism_check["is_target_realistic"]:
            recommendations.append(f"Consider extending timeline to {realism_check['recommended_days']} days for better retention")

        # Progress-based recommendations
        if analysis["review_hours"] > 0:
            recommendations.append("Prioritize reviewing 'needs_review' topics before learning new material")

        # Preference-based recommendations
        if request.preferences:
            if request.preferences.intensive_mode:
                recommendations.append("Use active recall and spaced repetition techniques")

            if request.preferences.learning_style:
                style_tips = {
                    "visual": "Use diagrams, charts, and visual aids while studying",
                    "auditory": "Try explaining concepts aloud or discussing with others",
                    "kinesthetic": "Include hands-on practice and coding exercises"
                }
                tip = style_tips.get(request.preferences.learning_style.value)
                if tip:
                    recommendations.append(tip)

        # General recommendations
        recommendations.extend([
            "Review previous day's material before starting new topics",
            "Track your progress and adjust the plan as needed",
            "Stay hydrated and maintain a consistent sleep schedule"
        ])

        return recommendations

    def _calculate_adaptability_score(
        self,
        request: StudyPlanRequest,
        realism_check: Dict[str, Any]
    ) -> float:
        """Calculate how adaptable the plan is to changes."""
        score = 1.0

        # Reduce score for tight timelines
        if not realism_check["is_target_realistic"]:
            score *= 0.7

        # Reduce score for high daily hours
        if request.time_constraints.daily_hours > 6:
            score *= 0.5
        elif request.time_constraints.daily_hours > 4:
            score *= 0.8

        # Increase score for buffer time
        if realism_check["buffer_days"] > 5:
            score = min(1.0, score * 1.2)

        return round(score, 2)

    def _analyze_feedback(
        self,
        feedback: Any,
        original_plan: StudyPlanResponse
    ) -> Dict[str, Any]:
        """Analyze user feedback for plan adjustment."""
        analysis = {
            "completion_rate": len(feedback.completed_days) / len(original_plan.daily_schedule),
            "time_variance": {},
            "difficulty_issues": feedback.difficulty_feedback,
            "suggested_changes": feedback.preferred_adjustments
        }

        # Analyze time spent vs planned
        for day_key, actual_minutes in feedback.time_spent_minutes.items():
            day_number = int(day_key.split('_')[1]) if '_' in day_key else 0
            if day_number <= len(original_plan.daily_schedule):
                planned_minutes = original_plan.daily_schedule[day_number - 1].total_study_minutes
                variance = (actual_minutes - planned_minutes) / max(planned_minutes, 1)
                analysis["time_variance"][day_key] = variance

        return analysis

    def get_cached_plan(self, plan_id: str) -> Optional[StudyPlanResponse]:
        """Get a cached study plan."""
        return self.plan_cache.get(plan_id)

    def clear_cache(self) -> Dict[str, int]:
        """Clear the plan cache."""
        count = len(self.plan_cache)
        self.plan_cache.clear()
        return {"cleared_plans": count}


# Global study plan service instance
ai_study_plan_service = AIStudyPlanService()