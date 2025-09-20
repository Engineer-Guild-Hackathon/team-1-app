"""Test configuration and fixtures."""

import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient

from src.main import app
from src.config.settings import settings


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def mock_llm_client():
    """Mock LLM client for testing."""
    mock = MagicMock()
    mock.generate_completion = AsyncMock(return_value="Mock LLM response")
    mock.generate_json_completion = AsyncMock(return_value={"mock": "data"})
    mock.health_check = AsyncMock(return_value={
        "providers": {
            "openai": {"status": "healthy"}
        }
    })
    return mock


@pytest.fixture
def sample_knowledge_nodes():
    """Sample knowledge nodes for testing."""
    return [
        {
            "id": "node1",
            "title": "Basic Concepts",
            "description": "Learn fundamental concepts",
            "prerequisites": [],
            "estimated_hours": 4.0,
            "current_user_status": "not_started"
        },
        {
            "id": "node2",
            "title": "Advanced Topics",
            "description": "Learn advanced concepts",
            "prerequisites": ["node1"],
            "estimated_hours": 6.0,
            "current_user_status": "not_started"
        }
    ]


@pytest.fixture
def sample_user_progress():
    """Sample user progress for testing."""
    return [
        {
            "node_id": "node1",
            "status": "completed",
            "mastery_score": 85,
            "study_time_minutes": 240
        },
        {
            "node_id": "node2",
            "status": "next",
            "mastery_score": 0,
            "study_time_minutes": 0
        }
    ]


@pytest.fixture
def sample_roadmap():
    """Sample roadmap for testing."""
    return {
        "nodes": [
            {
                "id": "node1",
                "title": "Basic Concepts",
                "description": "Learn fundamental concepts",
                "prerequisites": [],
                "estimated_hours": 4.0,
                "current_user_status": "not_started"
            },
            {
                "id": "node2",
                "title": "Advanced Topics",
                "description": "Learn advanced concepts",
                "prerequisites": ["node1"],
                "estimated_hours": 6.0,
                "current_user_status": "not_started"
            }
        ],
        "edges": [
            {
                "from": "node1",
                "to": "node2",
                "type": "prerequisite"
            }
        ],
        "total_estimated_hours": 10.0
    }


@pytest.fixture
def sample_assessment_request():
    """Sample assessment generation request."""
    return {
        "user_course_id": "course_123",
        "nodes": [
            {
                "id": "node1",
                "title": "Basic Concepts",
                "description": "Learn fundamental concepts",
                "prerequisites": [],
                "estimated_hours": 4.0,
                "current_user_status": "completed"
            }
        ],
        "difficulty_level": "medium",
        "question_count": 5
    }


@pytest.fixture
def sample_study_plan_request():
    """Sample study plan generation request."""
    return {
        "user_course_id": "course_123",
        "roadmap": {
            "nodes": [
                {
                    "id": "node1",
                    "title": "Basic Concepts",
                    "description": "Learn fundamental concepts",
                    "prerequisites": [],
                    "estimated_hours": 4.0,
                    "current_user_status": "not_started"
                }
            ],
            "edges": [],
            "total_estimated_hours": 4.0
        },
        "user_progress": [],
        "time_constraints": {
            "target_days": 7,
            "daily_hours": 2.0,
            "exclude_weekends": False
        }
    }


@pytest.fixture
def sample_roadmap_request():
    """Sample roadmap generation request."""
    return {
        "course_title": "Python Programming",
        "course_description": "Learn Python from basics to advanced",
        "difficulty_level": "beginner",
        "search_enabled": False
    }


# Override settings for testing
@pytest.fixture(autouse=True)
def override_settings():
    """Override settings for testing."""
    settings.environment = "test"
    settings.log_level = "DEBUG"
    settings.openai_api_key = "test-key"