"""Test service layer functionality."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from src.services.ai_assessment import AIAssessmentService
from src.services.ai_study_plan import AIStudyPlanService
from src.services.ai_roadmap import AIRoadmapService
from src.utils.graph_analyzer import GraphAnalyzer
from src.utils.time_calculator import TimeCalculator


class TestGraphAnalyzer:
    """Test graph analysis utilities."""

    def test_detect_cycles_no_cycles(self, sample_knowledge_nodes):
        """Test cycle detection with no cycles."""
        from src.models.roadmap import GeneratedNode
        from src.models.common import RoadmapEdge

        nodes = [
            GeneratedNode(
                id="node1",
                title="Node 1",
                description="First node",
                prerequisites=[],
                estimated_hours=2.0,
                position={"x": 0, "y": 0},
                difficulty="easy"
            ),
            GeneratedNode(
                id="node2",
                title="Node 2",
                description="Second node",
                prerequisites=["node1"],
                estimated_hours=3.0,
                position={"x": 100, "y": 0},
                difficulty="medium"
            )
        ]

        edges = [
            RoadmapEdge(from_node="node1", to_node="node2", relationship_type="prerequisite")
        ]

        cycles = GraphAnalyzer.detect_cycles(nodes, edges)
        assert len(cycles) == 0

    def test_detect_cycles_with_cycle(self):
        """Test cycle detection with cycles present."""
        from src.models.roadmap import GeneratedNode
        from src.models.common import RoadmapEdge

        nodes = [
            GeneratedNode(
                id="node1",
                title="Node 1",
                description="First node",
                prerequisites=["node2"],
                estimated_hours=2.0,
                position={"x": 0, "y": 0},
                difficulty="easy"
            ),
            GeneratedNode(
                id="node2",
                title="Node 2",
                description="Second node",
                prerequisites=["node1"],
                estimated_hours=3.0,
                position={"x": 100, "y": 0},
                difficulty="medium"
            )
        ]

        edges = [
            RoadmapEdge(from_node="node1", to_node="node2", relationship_type="prerequisite"),
            RoadmapEdge(from_node="node2", to_node="node1", relationship_type="prerequisite")
        ]

        cycles = GraphAnalyzer.detect_cycles(nodes, edges)
        assert len(cycles) > 0

    def test_calculate_graph_metrics(self):
        """Test graph metrics calculation."""
        from src.models.roadmap import GeneratedNode
        from src.models.common import RoadmapEdge

        nodes = [
            GeneratedNode(
                id="node1",
                title="Node 1",
                description="First node",
                prerequisites=[],
                estimated_hours=2.0,
                position={"x": 0, "y": 0},
                difficulty="easy"
            )
        ]

        edges = []

        metrics = GraphAnalyzer.calculate_graph_metrics(nodes, edges)

        assert "connectivity_score" in metrics
        assert "acyclic_score" in metrics
        assert "balance_score" in metrics
        assert "complexity_score" in metrics


class TestTimeCalculator:
    """Test time calculation utilities."""

    def test_calculate_available_study_days(self):
        """Test calculation of available study days."""
        study_days = TimeCalculator.calculate_available_study_days(
            start_date="2024-01-01",
            target_days=5,
            exclude_weekends=False
        )

        assert len(study_days) == 5
        assert study_days[0] == "2024-01-01"

    def test_calculate_available_study_days_exclude_weekends(self):
        """Test calculation excluding weekends."""
        study_days = TimeCalculator.calculate_available_study_days(
            start_date="2024-01-01",  # Monday
            target_days=5,
            exclude_weekends=True
        )

        assert len(study_days) == 5
        # Should not include weekends

    def test_estimate_completion_time(self, sample_knowledge_nodes):
        """Test completion time estimation."""
        from src.models.common import KnowledgeNodeInfo, NodeProgress

        nodes = [
            KnowledgeNodeInfo(
                id="node1",
                title="Node 1",
                description="First node",
                prerequisites=[],
                estimated_hours=4.0,
                current_user_status="not_started"
            )
        ]

        progress = []

        estimate = TimeCalculator.estimate_completion_time(
            nodes=nodes,
            user_progress=progress,
            daily_hours=2.0
        )

        assert "total_remaining_hours" in estimate
        assert "estimated_days" in estimate
        assert estimate["estimated_days"] > 0

    def test_calculate_study_intensity(self):
        """Test study intensity calculation."""
        intensity = TimeCalculator.calculate_study_intensity(
            daily_hours=3.0,
            total_nodes=10,
            target_days=30
        )

        assert "intensity_level" in intensity
        assert "sustainability_score" in intensity
        assert intensity["daily_hours"] == 3.0


class TestAIServices:
    """Test AI service classes."""

    @pytest.mark.asyncio
    async def test_assessment_service_cache_key_generation(self):
        """Test assessment service cache key generation."""
        from src.models.assessment import AssessmentGenerationRequest
        from src.models.common import KnowledgeNodeInfo, DifficultyLevel

        service = AIAssessmentService()

        request = AssessmentGenerationRequest(
            user_course_id="course_123",
            nodes=[
                KnowledgeNodeInfo(
                    id="node1",
                    title="Node 1",
                    description="Test node",
                    prerequisites=[],
                    estimated_hours=2.0,
                    current_user_status="not_started"
                )
            ],
            difficulty_level=DifficultyLevel.MEDIUM,
            question_count=5
        )

        cache_key = service._create_cache_key(request)
        assert isinstance(cache_key, str)
        assert len(cache_key) > 0

    def test_study_plan_service_initialization(self):
        """Test study plan service initialization."""
        service = AIStudyPlanService()

        assert service.plan_cache == {}
        assert len(service.color_themes) > 0

    def test_roadmap_service_cache_operations(self):
        """Test roadmap service cache operations."""
        service = AIRoadmapService()

        # Test cache clearing
        stats = service.clear_cache()
        assert "cleared_roadmaps" in stats
        assert isinstance(stats["cleared_roadmaps"], int)

    @pytest.mark.asyncio
    async def test_llm_client_health_check(self, mock_llm_client):
        """Test LLM client health check."""
        health_status = await mock_llm_client.health_check()

        assert "providers" in health_status
        assert "openai" in health_status["providers"]
        assert health_status["providers"]["openai"]["status"] == "healthy"


class TestErrorHandling:
    """Test error handling in services."""

    @pytest.mark.asyncio
    async def test_assessment_service_handles_llm_errors(self):
        """Test assessment service handles LLM errors gracefully."""
        from src.models.assessment import AssessmentGenerationRequest
        from src.models.common import KnowledgeNodeInfo, DifficultyLevel

        service = AIAssessmentService()

        request = AssessmentGenerationRequest(
            user_course_id="course_123",
            nodes=[
                KnowledgeNodeInfo(
                    id="node1",
                    title="Node 1",
                    description="Test node",
                    prerequisites=[],
                    estimated_hours=2.0,
                    current_user_status="not_started"
                )
            ],
            difficulty_level=DifficultyLevel.MEDIUM,
            question_count=5
        )

        # Mock LLM client to raise an exception
        with patch('src.services.llm_client.llm_client.generate_json_completion') as mock_llm:
            mock_llm.side_effect = Exception("LLM service unavailable")

            with pytest.raises(Exception, match="LLM service unavailable"):
                await service.generate_assessment(request)

    def test_graph_analyzer_handles_empty_input(self):
        """Test graph analyzer handles empty input gracefully."""
        metrics = GraphAnalyzer.calculate_graph_metrics([], [])

        assert "error" in metrics
        assert metrics["error"] == "No nodes provided"

    def test_time_calculator_handles_invalid_dates(self):
        """Test time calculator handles invalid dates."""
        # Should handle invalid date gracefully
        study_days = TimeCalculator.calculate_available_study_days(
            start_date="invalid-date",
            target_days=5,
            exclude_weekends=False
        )

        # Should return some valid dates (using current date as fallback)
        assert len(study_days) == 5