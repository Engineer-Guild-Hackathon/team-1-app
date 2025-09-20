"""Test study plan API endpoints."""

import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from src.models.study_plan import StudyPlanResponse, DailyStudyPlan, StudyActivity, PlanSummary
from src.models.common import ActivityType, Priority


@patch('src.services.ai_study_plan.ai_study_plan_service.generate_study_plan')
@pytest.mark.asyncio
async def test_generate_study_plan_success(mock_generate, client: TestClient, sample_study_plan_request):
    """Test successful study plan generation."""
    # Mock the service response
    mock_plan = StudyPlanResponse(
        id="plan_id",
        plan_id="plan_123",
        daily_schedule=[
            DailyStudyPlan(
                day=1,
                date="2024-01-01",
                total_study_minutes=120,
                activities=[
                    StudyActivity(
                        node_id="node1",
                        activity_type=ActivityType.LEARN,
                        estimated_minutes=60,
                        description="Learn basic concepts",
                        priority=Priority.HIGH
                    )
                ],
                daily_goal="Master Python basics",
                color_theme="#4CAF50"
            )
        ],
        summary=PlanSummary(
            total_days=7,
            total_hours=14.0,
            nodes_to_complete=1,
            estimated_completion_date="2024-01-07",
            difficulty_distribution={"easy": 1, "medium": 0, "hard": 0},
            weekly_breakdown={"week_1": 14}
        ),
        recommendations=["Take regular breaks"],
        adaptability_score=0.8
    )

    mock_generate.return_value = mock_plan

    response = client.post("/ai/generate-study-plan", json=sample_study_plan_request)

    assert response.status_code == 200
    data = response.json()

    assert data["plan_id"] == "plan_123"
    assert len(data["daily_schedule"]) == 1
    assert data["summary"]["total_days"] == 7
    assert data["adaptability_score"] == 0.8
    mock_generate.assert_called_once()


def test_generate_study_plan_validation_error(client: TestClient):
    """Test study plan generation with validation errors."""
    invalid_request = {
        "user_course_id": "course_123",
        "roadmap": {
            "nodes": [],  # Empty nodes should cause validation error
            "edges": [],
            "total_estimated_hours": 0
        },
        "user_progress": [],
        "time_constraints": {
            "target_days": 7,
            "daily_hours": 2.0
        }
    }

    response = client.post("/ai/generate-study-plan", json=invalid_request)

    assert response.status_code == 400
    assert "at least one knowledge node" in response.json()["detail"].lower()


def test_generate_study_plan_invalid_time_constraints(client: TestClient, sample_study_plan_request):
    """Test study plan generation with invalid time constraints."""
    sample_study_plan_request["time_constraints"]["target_days"] = 0  # Invalid

    response = client.post("/ai/generate-study-plan", json=sample_study_plan_request)

    assert response.status_code == 400
    assert "Target days must be at least 1" in response.json()["detail"]


def test_generate_study_plan_invalid_daily_hours(client: TestClient, sample_study_plan_request):
    """Test study plan generation with invalid daily hours."""
    sample_study_plan_request["time_constraints"]["daily_hours"] = 15  # Too many hours

    response = client.post("/ai/generate-study-plan", json=sample_study_plan_request)

    assert response.status_code == 400
    assert "Daily hours must be between 0.5 and 12" in response.json()["detail"]


@patch('src.services.ai_study_plan.ai_study_plan_service.adjust_study_plan')
@pytest.mark.asyncio
async def test_adjust_study_plan_success(mock_adjust, client: TestClient):
    """Test successful study plan adjustment."""
    from src.models.study_plan import StudyPlanAdjustmentResponse

    # Mock adjustment response
    mock_adjustment = StudyPlanAdjustmentResponse(
        id="adjustment_id",
        adjusted_plan_id="plan_123_v2",
        changes_made=["Reduced daily hours", "Added more practice"],
        updated_schedule=[],
        impact_analysis="Plan difficulty reduced by 20%"
    )

    mock_adjust.return_value = mock_adjustment

    adjustment_request = {
        "plan_id": "plan_123",
        "feedback": {
            "completed_days": [1, 2],
            "time_spent_minutes": {"day_1": 120, "day_2": 90},
            "difficulty_feedback": {"too_hard": ["node1"]},
            "preferred_adjustments": ["more_practice"]
        },
        "remaining_days": 5
    }

    response = client.post("/ai/adjust-study-plan", json=adjustment_request)

    assert response.status_code == 200
    data = response.json()

    assert data["adjusted_plan_id"] == "plan_123_v2"
    assert len(data["changes_made"]) == 2
    assert "Plan difficulty reduced" in data["impact_analysis"]
    mock_adjust.assert_called_once()


def test_adjust_study_plan_validation_error(client: TestClient):
    """Test study plan adjustment with validation errors."""
    invalid_request = {
        "plan_id": "plan_123",
        "feedback": {
            "completed_days": [],  # No completed days
            "time_spent_minutes": {},
            "difficulty_feedback": {},
            "preferred_adjustments": []
        },
        "remaining_days": 5
    }

    response = client.post("/ai/adjust-study-plan", json=invalid_request)

    assert response.status_code == 400
    assert "at least one completed day" in response.json()["detail"].lower()


@patch('src.services.ai_study_plan.ai_study_plan_service.get_cached_plan')
def test_get_study_plan_success(mock_get, client: TestClient):
    """Test successful study plan retrieval."""
    mock_plan = StudyPlanResponse(
        id="plan_id",
        plan_id="plan_123",
        daily_schedule=[],
        summary=PlanSummary(
            total_days=7,
            total_hours=14.0,
            nodes_to_complete=1,
            estimated_completion_date="2024-01-07",
            difficulty_distribution={"easy": 1},
            weekly_breakdown={"week_1": 14}
        ),
        recommendations=[],
        adaptability_score=0.8
    )

    mock_get.return_value = mock_plan

    response = client.get("/ai/study-plan/plan_123")

    assert response.status_code == 200
    data = response.json()

    assert data["plan_id"] == "plan_123"
    mock_get.assert_called_once_with("plan_123")


@patch('src.services.ai_study_plan.ai_study_plan_service.get_cached_plan')
def test_get_study_plan_not_found(mock_get, client: TestClient):
    """Test retrieval of non-existent study plan."""
    mock_get.return_value = None

    response = client.get("/ai/study-plan/nonexistent_plan")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


@patch('src.services.ai_study_plan.ai_study_plan_service.get_cached_plan')
def test_get_study_plan_summary(mock_get, client: TestClient):
    """Test study plan summary retrieval."""
    mock_plan = StudyPlanResponse(
        id="plan_id",
        plan_id="plan_123",
        daily_schedule=[
            DailyStudyPlan(
                day=1,
                date="2024-01-01",
                total_study_minutes=120,
                activities=[],
                daily_goal="Learn basics",
                color_theme="#4CAF50"
            )
        ],
        summary=PlanSummary(
            total_days=1,
            total_hours=2.0,
            nodes_to_complete=1,
            estimated_completion_date="2024-01-01",
            difficulty_distribution={"easy": 1},
            weekly_breakdown={"week_1": 2}
        ),
        recommendations=["Take breaks"],
        adaptability_score=0.8
    )

    mock_get.return_value = mock_plan

    response = client.get("/ai/study-plan/plan_123/summary")

    assert response.status_code == 200
    data = response.json()

    assert data["plan_id"] == "plan_123"
    assert "basic_summary" in data
    assert "daily_breakdown" in data
    assert len(data["daily_breakdown"]) == 1


def test_clear_study_plan_cache(client: TestClient):
    """Test clearing study plan cache."""
    response = client.post("/ai/clear-cache")

    assert response.status_code == 200
    data = response.json()

    assert "cleared_plans" in data