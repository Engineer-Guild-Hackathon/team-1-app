"""Study plan API endpoints."""

import logging
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse

from src.models.study_plan import (
    StudyPlanRequest,
    StudyPlanResponse,
    StudyPlanAdjustmentRequest,
    StudyPlanAdjustmentResponse
)
from src.services.ai_study_plan import ai_study_plan_service
from src.config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate-study-plan", response_model=StudyPlanResponse)
async def generate_study_plan(
    request: StudyPlanRequest
) -> StudyPlanResponse:
    """
    Generate an AI-powered personalized study plan.

    This endpoint analyzes the user's current progress, learning roadmap,
    and time constraints to create an optimized study schedule with daily
    activities and milestones.

    Args:
        request: Study plan generation parameters including roadmap, progress, and constraints

    Returns:
        Generated study plan with daily schedule and recommendations

    Raises:
        HTTPException: If generation fails or invalid parameters provided
    """
    try:
        logger.info(
            "Study plan generation requested",
            extra={
                "user_course_id": request.user_course_id,
                "target_days": request.time_constraints.target_days,
                "daily_hours": request.time_constraints.daily_hours,
                "node_count": len(request.roadmap.nodes)
            }
        )

        # Validate request
        if not request.roadmap.nodes:
            raise HTTPException(
                status_code=400,
                detail="Roadmap must contain at least one knowledge node"
            )

        if request.time_constraints.target_days < 1:
            raise HTTPException(
                status_code=400,
                detail="Target days must be at least 1"
            )

        if request.time_constraints.daily_hours < 0.5 or request.time_constraints.daily_hours > 12:
            raise HTTPException(
                status_code=400,
                detail="Daily hours must be between 0.5 and 12"
            )

        # Generate study plan
        study_plan = await ai_study_plan_service.generate_study_plan(request)

        logger.info(
            "Study plan generated successfully",
            extra={
                "plan_id": study_plan.plan_id,
                "total_days": len(study_plan.daily_schedule),
                "total_hours": study_plan.summary.total_hours,
                "adaptability_score": study_plan.adaptability_score
            }
        )

        return study_plan

    except ValueError as e:
        logger.warning(f"Study plan generation validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Study plan generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Study plan generation failed. Please try again."
        )


@router.post("/adjust-study-plan", response_model=StudyPlanAdjustmentResponse)
async def adjust_study_plan(
    request: StudyPlanAdjustmentRequest
) -> StudyPlanAdjustmentResponse:
    """
    Adjust an existing study plan based on user feedback.

    This endpoint modifies a study plan based on user progress feedback,
    time constraints changes, and learning preferences to optimize the
    remaining learning schedule.

    Args:
        request: Study plan adjustment parameters including feedback and new constraints

    Returns:
        Adjusted study plan with changes and impact analysis

    Raises:
        HTTPException: If adjustment fails or plan not found
    """
    try:
        logger.info(
            "Study plan adjustment requested",
            extra={
                "plan_id": request.plan_id,
                "completed_days": len(request.feedback.completed_days),
                "remaining_days": request.remaining_days
            }
        )

        # Validate request
        if request.remaining_days < 1:
            raise HTTPException(
                status_code=400,
                detail="Remaining days must be at least 1"
            )

        if not request.feedback.completed_days:
            raise HTTPException(
                status_code=400,
                detail="At least one completed day is required for adjustment"
            )

        # Adjust study plan
        adjustment = await ai_study_plan_service.adjust_study_plan(request)

        logger.info(
            "Study plan adjusted successfully",
            extra={
                "adjustment_id": adjustment.id,
                "adjusted_plan_id": adjustment.adjusted_plan_id,
                "changes_count": len(adjustment.changes_made)
            }
        )

        return adjustment

    except ValueError as e:
        logger.warning(f"Study plan adjustment validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Study plan adjustment failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Study plan adjustment failed. Please try again."
        )


@router.get("/study-plan/{plan_id}", response_model=StudyPlanResponse)
async def get_study_plan(plan_id: str) -> StudyPlanResponse:
    """
    Retrieve a previously generated study plan.

    Args:
        plan_id: Unique study plan identifier

    Returns:
        Study plan details including daily schedule and summary

    Raises:
        HTTPException: If study plan not found
    """
    try:
        study_plan = ai_study_plan_service.get_cached_plan(plan_id)
        if not study_plan:
            raise HTTPException(
                status_code=404,
                detail=f"Study plan {plan_id} not found"
            )

        return study_plan

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to retrieve study plan {plan_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve study plan"
        )


@router.get("/study-plan/{plan_id}/summary")
async def get_study_plan_summary(plan_id: str) -> Dict[str, Any]:
    """
    Get a summary of a study plan.

    Args:
        plan_id: Unique study plan identifier

    Returns:
        Study plan summary with key metrics

    Raises:
        HTTPException: If study plan not found
    """
    try:
        study_plan = ai_study_plan_service.get_cached_plan(plan_id)
        if not study_plan:
            raise HTTPException(
                status_code=404,
                detail=f"Study plan {plan_id} not found"
            )

        # Create enhanced summary
        summary = {
            "plan_id": study_plan.plan_id,
            "basic_summary": study_plan.summary.model_dump(),
            "daily_breakdown": [
                {
                    "day": day.day,
                    "date": day.date,
                    "study_minutes": day.total_study_minutes,
                    "activity_count": len(day.activities),
                    "goal": day.daily_goal
                }
                for day in study_plan.daily_schedule
            ],
            "adaptability_score": study_plan.adaptability_score,
            "recommendations_count": len(study_plan.recommendations)
        }

        return summary

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to get study plan summary {plan_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get study plan summary"
        )


@router.get("/study-plan/{plan_id}/calendar")
async def get_study_plan_calendar(plan_id: str) -> Dict[str, Any]:
    """
    Get calendar view of a study plan.

    Args:
        plan_id: Unique study plan identifier

    Returns:
        Calendar-formatted study plan data

    Raises:
        HTTPException: If study plan not found
    """
    try:
        study_plan = ai_study_plan_service.get_cached_plan(plan_id)
        if not study_plan:
            raise HTTPException(
                status_code=404,
                detail=f"Study plan {plan_id} not found"
            )

        # Format for calendar display
        calendar_events = []
        for day in study_plan.daily_schedule:
            event = {
                "date": day.date,
                "title": day.daily_goal,
                "color": day.color_theme,
                "duration_minutes": day.total_study_minutes,
                "activities": [
                    {
                        "description": activity.description,
                        "duration": activity.estimated_minutes,
                        "type": activity.activity_type,
                        "priority": activity.priority
                    }
                    for activity in day.activities
                ],
                "milestones": day.milestones
            }
            calendar_events.append(event)

        return {
            "plan_id": plan_id,
            "events": calendar_events,
            "total_events": len(calendar_events),
            "date_range": {
                "start": calendar_events[0]["date"] if calendar_events else None,
                "end": calendar_events[-1]["date"] if calendar_events else None
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to get study plan calendar {plan_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get study plan calendar"
        )


@router.post("/clear-cache")
async def clear_study_plan_cache() -> Dict[str, Any]:
    """
    Clear study plan cache (admin endpoint).

    Returns:
        Cache clearing statistics
    """
    try:
        stats = ai_study_plan_service.clear_cache()

        logger.info("Study plan cache cleared", extra=stats)

        return {
            **stats,
            "timestamp": "2024-01-01T00:00:00Z"  # Would use actual timestamp
        }

    except Exception as e:
        logger.error(f"Failed to clear study plan cache: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to clear cache"
        )