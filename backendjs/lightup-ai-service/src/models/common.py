"""Common data models used across the AI service."""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, ConfigDict


class DifficultyLevel(str, Enum):
    """Assessment difficulty levels."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class NodeStatus(str, Enum):
    """Knowledge node status."""
    NOT_STARTED = "not_started"
    NEXT = "next"
    COMPLETED = "completed"
    NEEDS_REVIEW = "needs_review"


class ActivityType(str, Enum):
    """Study activity types."""
    LEARN = "learn"
    REVIEW = "review"
    PRACTICE = "practice"
    ASSESS = "assess"


class Priority(str, Enum):
    """Priority levels."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class LearningStyle(str, Enum):
    """Learning style preferences."""
    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    MIXED = "mixed"


class KnowledgeNodeInfo(BaseModel):
    """Knowledge node information from the main backend."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "python-basics",
                "title": "Python Basics",
                "description": "Learn Python syntax and basic concepts",
                "prerequisites": [],
                "estimated_hours": 8.0,
                "current_user_status": "next"
            }
        }
    )

    id: str = Field(..., description="Unique node identifier")
    title: str = Field(..., description="Node title")
    description: str = Field(..., description="Detailed description of the node")
    prerequisites: List[str] = Field(default_factory=list, description="Required prerequisite node IDs")
    estimated_hours: float = Field(..., ge=0, description="Estimated learning hours")
    current_user_status: NodeStatus = Field(..., description="User's current status for this node")


class NodeProgress(BaseModel):
    """User progress on a knowledge node."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "node_id": "python-basics",
                "status": "completed",
                "mastery_score": 85,
                "study_time_minutes": 480
            }
        }
    )

    node_id: str = Field(..., description="Knowledge node ID")
    status: NodeStatus = Field(..., description="Current progress status")
    mastery_score: int = Field(default=0, ge=0, le=100, description="Mastery score (0-100)")
    study_time_minutes: int = Field(default=0, ge=0, description="Time spent studying in minutes")


class RoadmapEdge(BaseModel):
    """Roadmap edge representing prerequisite relationships."""

    from_node: str = Field(..., alias="from", description="Source node ID")
    to_node: str = Field(..., alias="to", description="Target node ID")
    relationship_type: str = Field(default="prerequisite", description="Type of relationship")


class RoadmapData(BaseModel):
    """Complete roadmap data including nodes and edges."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
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
                "edges": [],
                "total_estimated_hours": 8.0
            }
        }
    )

    nodes: List[KnowledgeNodeInfo] = Field(..., description="Knowledge nodes in the roadmap")
    edges: List[RoadmapEdge] = Field(default_factory=list, description="Prerequisite relationships")
    total_estimated_hours: float = Field(..., ge=0, description="Total estimated learning hours")


class BaseResponse(BaseModel):
    """Base response model with common fields."""

    id: str = Field(default_factory=lambda: str(uuid4()), description="Unique response ID")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    processing_time_seconds: Optional[float] = Field(default=None, description="Processing time")


class ErrorResponse(BaseModel):
    """Error response model."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid input data",
                    "details": {"field": "Missing required field"}
                }
            }
        }
    )

    error: Dict[str, Any] = Field(..., description="Error information")


class HealthCheckResponse(BaseModel):
    """Health check response model."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "healthy",
                "service": "lightup-ai-service",
                "version": "1.0.0",
                "timestamp": 1234567890.123,
                "environment": "development"
            }
        }
    )

    status: str = Field(..., description="Service health status")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="Service version")
    timestamp: float = Field(..., description="Current timestamp")
    environment: str = Field(..., description="Current environment")