"""Assessment API endpoints."""

import logging
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse

from src.models.assessment import (
    AssessmentGenerationRequest,
    AssessmentResponse,
    AssessmentEvaluationRequest,
    AssessmentEvaluationResponse,
    GeneratedQuestion
)
from src.services.ai_assessment import ai_assessment_service
from src.config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter()

# Store for temporary assessment data (in production, use Redis or database)
assessment_store: Dict[str, AssessmentResponse] = {}


@router.post("/generate-assessment", response_model=AssessmentResponse)
async def generate_assessment(
    request: AssessmentGenerationRequest
) -> AssessmentResponse:
    """
    Generate an AI-powered assessment based on knowledge nodes.

    This endpoint analyzes the provided knowledge nodes and user progress
    to create a tailored assessment with appropriate difficulty and coverage.

    Args:
        request: Assessment generation parameters including nodes, difficulty, and preferences

    Returns:
        Generated assessment with questions and evaluation criteria

    Raises:
        HTTPException: If generation fails or invalid parameters provided
    """
    try:
        logger.info(
            "Assessment generation requested",
            extra={
                "user_course_id": request.user_course_id,
                "node_count": len(request.nodes),
                "difficulty": request.difficulty_level,
                "question_count": request.question_count
            }
        )

        # Validate request
        if not request.nodes:
            raise HTTPException(
                status_code=400,
                detail="At least one knowledge node is required"
            )

        if request.question_count < 3 or request.question_count > 15:
            raise HTTPException(
                status_code=400,
                detail="Question count must be between 3 and 15"
            )

        # Generate assessment
        assessment = await ai_assessment_service.generate_assessment(request)

        # Store assessment for later evaluation
        assessment_store[assessment.assessment_id] = assessment

        logger.info(
            "Assessment generated successfully",
            extra={
                "assessment_id": assessment.assessment_id,
                "question_count": len(assessment.questions),
                "estimated_minutes": assessment.estimated_minutes
            }
        )

        return assessment

    except ValueError as e:
        logger.warning(f"Assessment generation validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Assessment generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Assessment generation failed. Please try again."
        )


@router.post("/evaluate-assessment", response_model=AssessmentEvaluationResponse)
async def evaluate_assessment(
    request: AssessmentEvaluationRequest
) -> AssessmentEvaluationResponse:
    """
    Evaluate user answers for an assessment using AI.

    This endpoint processes user answers against the original assessment
    questions and provides detailed scoring, feedback, and learning recommendations.

    Args:
        request: Assessment evaluation request with user answers

    Returns:
        Evaluation results with scores, feedback, and recommendations

    Raises:
        HTTPException: If evaluation fails or assessment not found
    """
    try:
        logger.info(
            "Assessment evaluation requested",
            extra={
                "assessment_id": request.assessment_id,
                "answer_count": len(request.answers)
            }
        )

        # Retrieve original assessment
        original_assessment = assessment_store.get(request.assessment_id)
        if not original_assessment:
            raise HTTPException(
                status_code=404,
                detail=f"Assessment {request.assessment_id} not found"
            )

        # Validate answers
        question_ids = {q.id for q in original_assessment.questions}
        answer_question_ids = {a.question_id for a in request.answers}

        missing_answers = question_ids - answer_question_ids
        if missing_answers:
            logger.warning(f"Missing answers for questions: {missing_answers}")

        # Evaluate assessment
        evaluation = await ai_assessment_service.evaluate_assessment(
            request,
            original_assessment.questions
        )

        logger.info(
            "Assessment evaluated successfully",
            extra={
                "assessment_id": request.assessment_id,
                "total_score": evaluation.total_score,
                "percentage": evaluation.percentage
            }
        )

        return evaluation

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Assessment evaluation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Assessment evaluation failed. Please try again."
        )


@router.get("/assessment/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(assessment_id: str) -> AssessmentResponse:
    """
    Retrieve a previously generated assessment.

    Args:
        assessment_id: Unique assessment identifier

    Returns:
        Assessment details including questions and criteria

    Raises:
        HTTPException: If assessment not found
    """
    try:
        assessment = assessment_store.get(assessment_id)
        if not assessment:
            raise HTTPException(
                status_code=404,
                detail=f"Assessment {assessment_id} not found"
            )

        return assessment

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to retrieve assessment {assessment_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve assessment"
        )


@router.get("/assessment/{assessment_id}/analytics")
async def get_assessment_analytics(assessment_id: str) -> Dict[str, Any]:
    """
    Get analytics for an assessment (placeholder for future implementation).

    Args:
        assessment_id: Unique assessment identifier

    Returns:
        Analytics data for the assessment

    Raises:
        HTTPException: If assessment not found
    """
    try:
        assessment = assessment_store.get(assessment_id)
        if not assessment:
            raise HTTPException(
                status_code=404,
                detail=f"Assessment {assessment_id} not found"
            )

        # Generate basic analytics
        analytics = await ai_assessment_service.get_assessment_analytics(
            assessment_id,
            []  # Would pass actual evaluations in production
        )

        return analytics

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to generate analytics for {assessment_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate assessment analytics"
        )


@router.delete("/assessment/{assessment_id}")
async def delete_assessment(assessment_id: str) -> Dict[str, str]:
    """
    Delete a stored assessment.

    Args:
        assessment_id: Unique assessment identifier

    Returns:
        Confirmation message

    Raises:
        HTTPException: If assessment not found
    """
    try:
        if assessment_id not in assessment_store:
            raise HTTPException(
                status_code=404,
                detail=f"Assessment {assessment_id} not found"
            )

        del assessment_store[assessment_id]

        logger.info(f"Assessment {assessment_id} deleted")

        return {"message": f"Assessment {assessment_id} deleted successfully"}

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to delete assessment {assessment_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete assessment"
        )


@router.post("/clear-cache")
async def clear_assessment_cache() -> Dict[str, Any]:
    """
    Clear assessment cache (admin endpoint).

    Returns:
        Cache clearing statistics
    """
    try:
        # Clear service cache
        service_stats = ai_assessment_service.clear_cache()

        # Clear local store
        store_count = len(assessment_store)
        assessment_store.clear()

        stats = {
            **service_stats,
            "cleared_store": store_count,
            "timestamp": "2024-01-01T00:00:00Z"  # Would use actual timestamp
        }

        logger.info("Assessment cache cleared", extra=stats)

        return stats

    except Exception as e:
        logger.error(f"Failed to clear assessment cache: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to clear cache"
        )