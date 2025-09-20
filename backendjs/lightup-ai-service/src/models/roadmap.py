"""Roadmap generation related data models."""

from typing import Dict, List, Optional

from pydantic import BaseModel, Field, ConfigDict

from .common import BaseResponse, KnowledgeNodeInfo, RoadmapEdge


class RoadmapGenerationRequest(BaseModel):
    """Request model for generating roadmaps."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "course_title": "Python Programming",
                "course_description": "Learn Python from basics to advanced",
                "custom_input": "Focus on web development with Django",
                "search_enabled": True,
                "target_hours": 50,
                "difficulty_level": "beginner"
            }
        }
    )

    course_title: str = Field(..., description="Course title")
    course_description: str = Field(..., description="Course description")
    custom_input: Optional[str] = Field(default=None, description="Custom learning requirements")
    search_enabled: bool = Field(default=True, description="Whether to use web search for current info")
    target_hours: Optional[int] = Field(default=None, ge=10, le=500, description="Target learning hours")
    difficulty_level: str = Field(default="beginner", description="Target difficulty level")


class GeneratedNode(BaseModel):
    """A generated knowledge node in the roadmap."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "python-basics",
                "title": "Python Basics",
                "description": "Learn Python syntax, variables, and data types",
                "prerequisites": [],
                "estimated_hours": 8.0,
                "position": {"x": 100, "y": 100},
                "difficulty": "easy",
                "resources": ["tutorial_link", "practice_exercises"]
            }
        }
    )

    id: str = Field(..., description="Unique node identifier")
    title: str = Field(..., description="Node title")
    description: str = Field(..., description="Detailed description")
    prerequisites: List[str] = Field(default_factory=list, description="Prerequisite node IDs")
    estimated_hours: float = Field(..., ge=0.5, description="Estimated learning hours")
    position: Dict[str, float] = Field(..., description="Position coordinates for visualization")
    difficulty: str = Field(..., description="Difficulty level of this node")
    resources: List[str] = Field(default_factory=list, description="Recommended learning resources")


class RoadmapGenerationResponse(BaseResponse):
    """Response model for generated roadmaps."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "roadmap_123",
                "roadmap_id": "roadmap_123",
                "title": "Python Programming Learning Path",
                "nodes": [],
                "edges": [],
                "metadata": {
                    "total_nodes": 10,
                    "total_hours": 50.0,
                    "difficulty_levels": {"easy": 4, "medium": 4, "hard": 2}
                }
            }
        }
    )

    roadmap_id: str = Field(..., description="Generated roadmap ID")
    title: str = Field(..., description="Roadmap title")
    nodes: List[GeneratedNode] = Field(..., description="Generated knowledge nodes")
    edges: List[RoadmapEdge] = Field(..., description="Node relationships")
    metadata: Dict[str, any] = Field(..., description="Additional roadmap metadata")


class RoadmapValidationRequest(BaseModel):
    """Request model for validating roadmaps."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "nodes": [],
                "edges": [],
                "validation_rules": ["no_cycles", "connected_graph", "reasonable_hours"]
            }
        }
    )

    nodes: List[GeneratedNode] = Field(..., description="Nodes to validate")
    edges: List[RoadmapEdge] = Field(..., description="Edges to validate")
    validation_rules: List[str] = Field(..., description="Validation rules to apply")


class ValidationIssue(BaseModel):
    """A validation issue found in the roadmap."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "severity": "error",
                "message": "Circular dependency detected",
                "affected_nodes": ["node_1", "node_2"],
                "suggestion": "Remove dependency from node_2 to node_1"
            }
        }
    )

    severity: str = Field(..., description="Issue severity (error, warning, info)")
    message: str = Field(..., description="Description of the issue")
    affected_nodes: List[str] = Field(..., description="Nodes affected by this issue")
    suggestion: str = Field(..., description="Suggested fix for the issue")


class RoadmapValidationResponse(BaseResponse):
    """Response model for roadmap validation."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "validation_123",
                "is_valid": True,
                "issues": [],
                "suggestions": ["Consider adding more intermediate nodes"],
                "metrics": {
                    "connectivity_score": 0.9,
                    "balance_score": 0.8,
                    "complexity_score": 0.7
                }
            }
        }
    )

    is_valid: bool = Field(..., description="Whether the roadmap is valid")
    issues: List[ValidationIssue] = Field(..., description="Validation issues found")
    suggestions: List[str] = Field(..., description="General improvement suggestions")
    metrics: Dict[str, float] = Field(..., description="Roadmap quality metrics")