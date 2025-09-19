"""Study plan related data models."""

from datetime import date, datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, ConfigDict

from .common import (
    BaseResponse,
    ActivityType,
    Priority,
    LearningStyle,
    RoadmapData,
    NodeProgress
)


class TimeConstraints(BaseModel):
    """Time constraints for study plan generation."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "target_days": 30,
                "daily_hours": 2.0,
                "start_date": "2024-01-01",
                "exclude_weekends": False
            }
        }
    )

    target_days: int = Field(..., ge=1, le=365, description="Target number of days")
    daily_hours: float = Field(..., ge=0.5, le=12, description="Available hours per day")
    start_date: Optional[str] = Field(default=None, description="Start date (YYYY-MM-DD)")
    exclude_weekends: bool = Field(default=False, description="Whether to exclude weekends")


class StudyPreferences(BaseModel):
    """User preferences for study plan generation."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "learning_style": "visual",
                "intensive_mode": False,
                "break_intervals": 25,
                "preferred_time_slots": ["morning", "evening"],
                "difficulty_preference": "progressive"
            }
        }
    )

    learning_style: Optional[LearningStyle] = Field(default=None, description="Preferred learning style")
    intensive_mode: bool = Field(default=False, description="Whether to use intensive study mode")
    break_intervals: int = Field(default=25, ge=15, le=90, description="Study break intervals in minutes")
    preferred_time_slots: Optional[List[str]] = Field(default=None, description="Preferred study times")
    difficulty_preference: str = Field(default="progressive", description="Difficulty progression preference")


class StudyPlanRequest(BaseModel):
    """Request model for generating study plans."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_course_id": "course_123",
                "roadmap": {
                    "nodes": [],
                    "edges": [],
                    "total_estimated_hours": 50.0
                },
                "user_progress": [],
                "time_constraints": {
                    "target_days": 30,
                    "daily_hours": 2.0
                },
                "preferences": {
                    "learning_style": "visual",
                    "intensive_mode": False
                }
            }
        }
    )

    user_course_id: str = Field(..., description="User course identifier")
    roadmap: RoadmapData = Field(..., description="Course roadmap data")
    user_progress: List[NodeProgress] = Field(..., description="Current user progress")
    time_constraints: TimeConstraints = Field(..., description="Time constraints")
    preferences: Optional[StudyPreferences] = Field(default=None, description="User preferences")


class StudyActivity(BaseModel):
    """Individual study activity within a day."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "node_id": "python-basics",
                "activity_type": "learn",
                "estimated_minutes": 60,
                "description": "Learn Python syntax and variables",
                "priority": "high",
                "resources": ["tutorial_link", "exercise_set"]
            }
        }
    )

    node_id: str = Field(..., description="Knowledge node ID")
    activity_type: ActivityType = Field(..., description="Type of study activity")
    estimated_minutes: int = Field(..., ge=15, le=240, description="Estimated time in minutes")
    description: str = Field(..., description="Activity description")
    priority: Priority = Field(..., description="Activity priority")
    resources: Optional[List[str]] = Field(default=None, description="Recommended resources")


class DailyStudyPlan(BaseModel):
    """Study plan for a single day."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "day": 1,
                "date": "2024-01-01",
                "total_study_minutes": 120,
                "activities": [],
                "daily_goal": "Master Python basics",
                "color_theme": "#4CAF50",
                "milestones": ["Complete variables chapter"]
            }
        }
    )

    day: int = Field(..., ge=1, description="Day number (1-based)")
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    total_study_minutes: int = Field(..., ge=0, description="Total study time for the day")
    activities: List[StudyActivity] = Field(..., description="Study activities for the day")
    daily_goal: str = Field(..., description="Main goal for the day")
    color_theme: str = Field(..., description="Color theme for UI display")
    milestones: List[str] = Field(default_factory=list, description="Key milestones to achieve")


class PlanSummary(BaseModel):
    """Summary of the generated study plan."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_days": 30,
                "total_hours": 60.0,
                "nodes_to_complete": 10,
                "estimated_completion_date": "2024-01-30",
                "difficulty_distribution": {"easy": 3, "medium": 5, "hard": 2},
                "weekly_breakdown": {"week_1": 15, "week_2": 15}
            }
        }
    )

    total_days: int = Field(..., ge=1, description="Total number of study days")
    total_hours: float = Field(..., ge=0, description="Total study hours")
    nodes_to_complete: int = Field(..., ge=0, description="Number of nodes to complete")
    estimated_completion_date: str = Field(..., description="Estimated completion date")
    difficulty_distribution: Dict[str, int] = Field(..., description="Distribution of difficulty levels")
    weekly_breakdown: Dict[str, int] = Field(..., description="Hours per week breakdown")


class StudyPlanResponse(BaseResponse):
    """Response model for generated study plans."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "plan_123",
                "plan_id": "plan_123",
                "daily_schedule": [],
                "summary": {},
                "recommendations": ["Take breaks every 25 minutes"],
                "adaptability_score": 0.8
            }
        }
    )

    plan_id: str = Field(..., description="Generated plan ID")
    daily_schedule: List[DailyStudyPlan] = Field(..., description="Daily study schedule")
    summary: PlanSummary = Field(..., description="Plan summary")
    recommendations: List[str] = Field(default_factory=list, description="Study recommendations")
    adaptability_score: float = Field(default=1.0, ge=0, le=1, description="Plan adaptability score")


class PlanFeedback(BaseModel):
    """Feedback for adjusting study plans."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "completed_days": [1, 2, 3],
                "time_spent_minutes": {"day_1": 120, "day_2": 90},
                "difficulty_feedback": {"too_easy": ["node_1"], "too_hard": ["node_2"]},
                "preferred_adjustments": ["more_practice", "less_theory"]
            }
        }
    )

    completed_days: List[int] = Field(..., description="Days successfully completed")
    time_spent_minutes: Dict[str, int] = Field(..., description="Actual time spent per day")
    difficulty_feedback: Dict[str, List[str]] = Field(..., description="Difficulty feedback by node")
    preferred_adjustments: List[str] = Field(..., description="Requested adjustments")


class StudyPlanAdjustmentRequest(BaseModel):
    """Request model for adjusting study plans."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "plan_id": "plan_123",
                "feedback": {},
                "remaining_days": 25,
                "new_constraints": {
                    "daily_hours": 1.5
                }
            }
        }
    )

    plan_id: str = Field(..., description="Plan ID to adjust")
    feedback: PlanFeedback = Field(..., description="User feedback")
    remaining_days: int = Field(..., ge=1, description="Days remaining in plan")
    new_constraints: Optional[Dict[str, any]] = Field(default=None, description="Updated constraints")


class StudyPlanAdjustmentResponse(BaseResponse):
    """Response model for adjusted study plans."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "adjustment_123",
                "adjusted_plan_id": "plan_123_v2",
                "changes_made": ["Reduced daily hours", "Added more practice"],
                "updated_schedule": [],
                "impact_analysis": "Plan difficulty reduced by 20%"
            }
        }
    )

    adjusted_plan_id: str = Field(..., description="ID of the adjusted plan")
    changes_made: List[str] = Field(..., description="List of changes made")
    updated_schedule: List[DailyStudyPlan] = Field(..., description="Updated daily schedule")
    impact_analysis: str = Field(..., description="Analysis of the changes' impact")