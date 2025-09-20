"""RoadmapDisplay API endpoints."""

import logging
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse

from src.models.roadmap import (
    RoadmapGenerationRequest,
    RoadmapGenerationResponse,
    RoadmapValidationRequest,
    RoadmapValidationResponse
)
from src.services.ai_roadmap import ai_roadmap_service
from src.config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate-roadmap", response_model=RoadmapGenerationResponse)
async def generate_roadmap(
    request: RoadmapGenerationRequest
) -> RoadmapGenerationResponse:
    """
    Generate an AI-powered learning roadmap.

    This endpoint creates a comprehensive learning roadmap with knowledge nodes,
    prerequisites, and optimal learning paths based on the course requirements
    and user preferences.

    Args:
        request: RoadmapDisplay generation parameters including course details and preferences

    Returns:
        Generated roadmap with nodes, edges, and metadata

    Raises:
        HTTPException: If generation fails or invalid parameters provided
    """
    try:
        logger.info(
            "RoadmapDisplay generation requested",
            extra={
                "course_title": request.course_title,
                "target_hours": request.target_hours,
                "difficulty": request.difficulty_level,
                "search_enabled": request.search_enabled
            }
        )

        # Validate request
        if not request.course_title.strip():
            raise HTTPException(
                status_code=400,
                detail="Course title is required"
            )

        if not request.course_description.strip():
            raise HTTPException(
                status_code=400,
                detail="Course description is required"
            )

        if request.target_hours is not None and (request.target_hours < 10 or request.target_hours > 500):
            raise HTTPException(
                status_code=400,
                detail="Target hours must be between 10 and 500"
            )

        # Generate roadmap
        roadmap = await ai_roadmap_service.generate_roadmap(request)

        logger.info(
            "RoadmapDisplay generated successfully",
            extra={
                "roadmap_id": roadmap.roadmap_id,
                "node_count": len(roadmap.nodes),
                "edge_count": len(roadmap.edges),
                "total_hours": roadmap.metadata.get("total_hours", 0)
            }
        )

        return roadmap

    except ValueError as e:
        logger.warning(f"RoadmapDisplay generation validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"RoadmapDisplay generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="RoadmapDisplay generation failed. Please try again."
        )


@router.post("/validate-roadmap", response_model=RoadmapValidationResponse)
async def validate_roadmap(
    request: RoadmapValidationRequest
) -> RoadmapValidationResponse:
    """
    Validate a roadmap structure.

    This endpoint checks the roadmap for structural issues like cycles,
    disconnected components, and unreasonable time estimates, providing
    detailed feedback and suggestions for improvement.

    Args:
        request: RoadmapDisplay validation parameters including nodes and edges

    Returns:
        Validation results with issues, suggestions, and quality metrics

    Raises:
        HTTPException: If validation fails
    """
    try:
        logger.info(
            "RoadmapDisplay validation requested",
            extra={
                "node_count": len(request.nodes),
                "edge_count": len(request.edges),
                "validation_rules": request.validation_rules
            }
        )

        # Validate request
        if not request.nodes:
            raise HTTPException(
                status_code=400,
                detail="At least one node is required for validation"
            )

        if not request.validation_rules:
            raise HTTPException(
                status_code=400,
                detail="At least one validation rule must be specified"
            )

        # Validate roadmap
        validation_result = await ai_roadmap_service.validate_roadmap(request)

        logger.info(
            "RoadmapDisplay validation completed",
            extra={
                "is_valid": validation_result.is_valid,
                "issue_count": len(validation_result.issues),
                "suggestion_count": len(validation_result.suggestions)
            }
        )

        return validation_result

    except ValueError as e:
        logger.warning(f"RoadmapDisplay validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"RoadmapDisplay validation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="RoadmapDisplay validation failed. Please try again."
        )


@router.get("/roadmap/{roadmap_id}")
async def get_roadmap(roadmap_id: str) -> Dict[str, Any]:
    """
    Retrieve a previously generated roadmap.

    Args:
        roadmap_id: Unique roadmap identifier

    Returns:
        RoadmapDisplay details if found in cache

    Raises:
        HTTPException: If roadmap not found
    """
    try:
        # Try to get from cache (simplified for this example)
        cache_key = f"roadmap_{roadmap_id}"
        roadmap = ai_roadmap_service.get_cached_roadmap(cache_key)

        if not roadmap:
            raise HTTPException(
                status_code=404,
                detail=f"RoadmapDisplay {roadmap_id} not found"
            )

        return roadmap.model_dump()

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to retrieve roadmap {roadmap_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve roadmap"
        )


@router.get("/roadmap/{roadmap_id}/metrics")
async def get_roadmap_metrics(roadmap_id: str) -> Dict[str, Any]:
    """
    Get quality metrics for a roadmap.

    Args:
        roadmap_id: Unique roadmap identifier

    Returns:
        RoadmapDisplay quality metrics and analysis

    Raises:
        HTTPException: If roadmap not found
    """
    try:
        cache_key = f"roadmap_{roadmap_id}"
        roadmap = ai_roadmap_service.get_cached_roadmap(cache_key)

        if not roadmap:
            raise HTTPException(
                status_code=404,
                detail=f"RoadmapDisplay {roadmap_id} not found"
            )

        # Calculate metrics using graph analyzer
        from src.utils.graph_analyzer import GraphAnalyzer
        metrics = GraphAnalyzer.calculate_graph_metrics(roadmap.nodes, roadmap.edges)

        # Add additional analysis
        enhanced_metrics = {
            "roadmap_id": roadmap_id,
            "basic_metrics": roadmap.metadata,
            "quality_metrics": metrics,
            "learning_paths": GraphAnalyzer.calculate_learning_paths(roadmap.nodes, roadmap.edges),
            "critical_path": GraphAnalyzer.calculate_critical_path(roadmap.nodes, roadmap.edges)
        }

        return enhanced_metrics

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to get roadmap metrics {roadmap_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get roadmap metrics"
        )


@router.get("/roadmap/{roadmap_id}/visualization")
async def get_roadmap_visualization(roadmap_id: str) -> Dict[str, Any]:
    """
    Get visualization data for a roadmap.

    Args:
        roadmap_id: Unique roadmap identifier

    Returns:
        RoadmapDisplay visualization data formatted for frontend display

    Raises:
        HTTPException: If roadmap not found
    """
    try:
        cache_key = f"roadmap_{roadmap_id}"
        roadmap = ai_roadmap_service.get_cached_roadmap(cache_key)

        if not roadmap:
            raise HTTPException(
                status_code=404,
                detail=f"RoadmapDisplay {roadmap_id} not found"
            )

        # Format for visualization
        visualization_data = {
            "roadmap_id": roadmap_id,
            "title": roadmap.title,
            "nodes": [
                {
                    "id": node.id,
                    "label": node.title,
                    "description": node.description,
                    "x": node.position.get("x", 0),
                    "y": node.position.get("y", 0),
                    "hours": node.estimated_hours,
                    "difficulty": node.difficulty,
                    "color": {
                        "easy": "#4CAF50",
                        "medium": "#FF9800",
                        "hard": "#F44336"
                    }.get(node.difficulty, "#9E9E9E"),
                    "prerequisites": node.prerequisites,
                    "resources": node.resources
                }
                for node in roadmap.nodes
            ],
            "edges": [
                {
                    "id": f"edge_{i}",
                    "source": edge.from_node,
                    "target": edge.to_node,
                    "type": edge.relationship_type,
                    "animated": True
                }
                for i, edge in enumerate(roadmap.edges)
            ],
            "metadata": roadmap.metadata
        }

        return visualization_data

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Failed to get roadmap visualization {roadmap_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get roadmap visualization"
        )


@router.post("/clear-cache")
async def clear_roadmap_cache() -> Dict[str, Any]:
    """
    Clear roadmap cache (admin endpoint).

    Returns:
        Cache clearing statistics
    """
    try:
        stats = ai_roadmap_service.clear_cache()

        logger.info("RoadmapDisplay cache cleared", extra=stats)

        return {
            **stats,
            "timestamp": "2024-01-01T00:00:00Z"  # Would use actual timestamp
        }

    except Exception as e:
        logger.error(f"Failed to clear roadmap cache: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to clear cache"
        )