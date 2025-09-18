"""Test assessment API endpoints."""

import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from src.models.assessment import AssessmentResponse, GeneratedQuestion, EvaluationCriteria


@patch('src.services.ai_assessment.ai_assessment_service.generate_assessment')
@pytest.mark.asyncio
async def test_generate_assessment_success(mock_generate, client: TestClient, sample_assessment_request):
    """Test successful assessment generation."""
    # Mock the service response
    mock_assessment = AssessmentResponse(
        id="test_id",
        assessment_id="test_assessment",
        questions=[
            GeneratedQuestion(
                id="q1",
                node_id="node1",
                question="What is Python?",
                question_type="multiple_choice",
                options=["A language", "A snake", "A tool", "All above"],
                correct_answer="A language",
                points=10,
                difficulty="easy",
                explanation="Python is a programming language",
                keywords=["python", "language"]
            )
        ],
        estimated_minutes=15,
        evaluation_criteria=EvaluationCriteria()
    )

    mock_generate.return_value = mock_assessment

    response = client.post("/ai/generate-assessment", json=sample_assessment_request)

    assert response.status_code == 200
    data = response.json()

    assert data["assessment_id"] == "test_assessment"
    assert len(data["questions"]) == 1
    assert data["estimated_minutes"] == 15
    mock_generate.assert_called_once()


def test_generate_assessment_validation_error(client: TestClient):
    """Test assessment generation with validation errors."""
    # Test with empty nodes
    invalid_request = {
        "user_course_id": "course_123",
        "nodes": [],  # Empty nodes should cause validation error
        "difficulty_level": "medium",
        "question_count": 5
    }

    response = client.post("/ai/generate-assessment", json=invalid_request)

    assert response.status_code == 400
    assert "At least one knowledge node is required" in response.json()["detail"]


def test_generate_assessment_invalid_question_count(client: TestClient, sample_assessment_request):
    """Test assessment generation with invalid question count."""
    sample_assessment_request["question_count"] = 20  # Too many questions

    response = client.post("/ai/generate-assessment", json=sample_assessment_request)

    assert response.status_code == 400
    assert "Question count must be between 3 and 15" in response.json()["detail"]


@patch('src.services.ai_assessment.ai_assessment_service.evaluate_assessment')
@pytest.mark.asyncio
async def test_evaluate_assessment_success(mock_evaluate, client: TestClient):
    """Test successful assessment evaluation."""
    from src.models.assessment import AssessmentEvaluationResponse, QuestionScore, NodeScore

    # First create an assessment to evaluate
    assessment_request = {
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
        "question_count": 3
    }

    # Mock assessment creation
    with patch('src.services.ai_assessment.ai_assessment_service.generate_assessment') as mock_gen:
        mock_assessment = AssessmentResponse(
            id="test_id",
            assessment_id="test_assessment",
            questions=[
                GeneratedQuestion(
                    id="q1",
                    node_id="node1",
                    question="What is Python?",
                    question_type="short_answer",
                    correct_answer="Programming language",
                    points=10,
                    difficulty="easy",
                    explanation="Python is a programming language",
                    keywords=["python", "language"]
                )
            ],
            estimated_minutes=15,
            evaluation_criteria=EvaluationCriteria()
        )
        mock_gen.return_value = mock_assessment

        # Create assessment
        create_response = client.post("/ai/generate-assessment", json=assessment_request)
        assert create_response.status_code == 200

    # Mock evaluation response
    mock_evaluation = AssessmentEvaluationResponse(
        id="eval_id",
        total_score=85.0,
        max_score=100,
        percentage=85.0,
        question_scores=[
            QuestionScore(
                question_id="q1",
                score=8.5,
                max_score=10,
                feedback="Good answer",
                is_correct=True
            )
        ],
        node_scores=[
            NodeScore(
                node_id="node1",
                score=85,
                feedback="Good understanding",
                recommended_action="continue"
            )
        ],
        overall_feedback="Well done!",
        study_recommendations=[]
    )

    mock_evaluate.return_value = mock_evaluation

    # Submit evaluation
    evaluation_request = {
        "assessment_id": "test_assessment",
        "answers": [
            {
                "question_id": "q1",
                "answer": "Programming language"
            }
        ]
    }

    response = client.post("/ai/evaluate-assessment", json=evaluation_request)

    assert response.status_code == 200
    data = response.json()

    assert data["total_score"] == 85.0
    assert data["percentage"] == 85.0
    assert len(data["question_scores"]) == 1
    assert len(data["node_scores"]) == 1


def test_evaluate_assessment_not_found(client: TestClient):
    """Test evaluation of non-existent assessment."""
    evaluation_request = {
        "assessment_id": "nonexistent_assessment",
        "answers": [
            {
                "question_id": "q1",
                "answer": "Some answer"
            }
        ]
    }

    response = client.post("/ai/evaluate-assessment", json=evaluation_request)

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_get_assessment_not_found(client: TestClient):
    """Test retrieving non-existent assessment."""
    response = client.get("/ai/assessment/nonexistent_id")

    assert response.status_code == 404


def test_clear_assessment_cache(client: TestClient):
    """Test clearing assessment cache."""
    response = client.post("/ai/clear-cache")

    assert response.status_code == 200
    data = response.json()

    assert "cleared_questions" in data
    assert "cleared_evaluations" in data
    assert "cleared_store" in data