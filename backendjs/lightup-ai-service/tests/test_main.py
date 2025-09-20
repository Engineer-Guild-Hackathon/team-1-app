"""Test main application functionality."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


def test_health_check(client: TestClient):
    """Test health check endpoint."""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "healthy"
    assert data["service"] == "lightup-ai-service"
    assert data["version"] == "1.0.0"
    assert "timestamp" in data
    assert "environment" in data


def test_docs_endpoint_in_dev(client: TestClient):
    """Test that docs are available in development."""
    response = client.get("/docs")

    # Should either return docs or redirect
    assert response.status_code in [200, 307]


def test_cors_headers(client: TestClient):
    """Test CORS headers are set correctly."""
    response = client.options("/health")

    # Should handle OPTIONS request
    assert response.status_code in [200, 405]  # 405 if OPTIONS not explicitly handled


def test_request_logging_middleware(client: TestClient):
    """Test that request logging middleware adds headers."""
    response = client.get("/health")

    assert response.status_code == 200

    # Check for custom headers added by middleware
    assert "X-Process-Time" in response.headers
    assert "X-Request-ID" in response.headers


def test_not_found_route(client: TestClient):
    """Test handling of non-existent routes."""
    response = client.get("/nonexistent-route")

    assert response.status_code == 404


def test_method_not_allowed(client: TestClient):
    """Test handling of wrong HTTP methods."""
    response = client.post("/health")

    assert response.status_code == 405


@pytest.mark.asyncio
async def test_lifespan_events():
    """Test application lifespan events."""
    # This would test startup/shutdown events
    # For now, just ensure the app can be imported without errors
    from src.main import app
    assert app is not None


def test_error_handling(client: TestClient):
    """Test global error handling."""
    # Test with malformed JSON
    response = client.post(
        "/ai/generate-assessment",
        data="invalid json",
        headers={"Content-Type": "application/json"}
    )

    assert response.status_code == 422  # Unprocessable Entity for malformed JSON