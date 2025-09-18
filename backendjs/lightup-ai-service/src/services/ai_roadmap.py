"""AI-powered roadmap generation and validation service."""

import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from uuid import uuid4

from src.models.roadmap import (
    RoadmapGenerationRequest,
    RoadmapGenerationResponse,
    RoadmapValidationRequest,
    RoadmapValidationResponse,
    GeneratedNode,
    ValidationIssue
)
from src.models.common import RoadmapEdge
from src.services.llm_client import llm_client
from src.utils.prompt_templates import PromptTemplates
from src.utils.graph_analyzer import GraphAnalyzer
from src.config.settings import settings

logger = logging.getLogger(__name__)


class AIRoadmapService:
    """Service for AI-powered roadmap generation and validation."""

    def __init__(self):
        """Initialize the roadmap service."""
        self.roadmap_cache = {}  # Simple in-memory cache
        self.search_client = None  # Would initialize search client here

    async def generate_roadmap(
        self,
        request: RoadmapGenerationRequest
    ) -> RoadmapGenerationResponse:
        """
        Generate an AI-powered learning roadmap.

        Args:
            request: Roadmap generation request

        Returns:
            Generated roadmap response
        """
        start_time = datetime.utcnow()

        try:
            logger.info(
                "Starting roadmap generation",
                extra={
                    "course_title": request.course_title,
                    "target_hours": request.target_hours,
                    "difficulty": request.difficulty_level,
                    "search_enabled": request.search_enabled
                }
            )

            # Create cache key
            cache_key = self._create_cache_key(request)

            # Check cache first
            if cache_key in self.roadmap_cache:
                logger.info("Returning cached roadmap")
                return self.roadmap_cache[cache_key]

            # Gather additional context if search is enabled
            search_context = ""
            if request.search_enabled and request.custom_input:
                search_context = await self._gather_search_context(request)

            # Create enhanced prompt with search context
            enhanced_prompt = PromptTemplates.roadmap_generation_prompt(
                course_title=request.course_title,
                course_description=request.course_description + f"\n\nAdditional Context: {search_context}",
                custom_input=request.custom_input,
                target_hours=request.target_hours,
                difficulty_level=request.difficulty_level
            )

            # Define expected schema for roadmap
            roadmap_schema = {
                "type": "object",
                "required": ["roadmap_id", "title", "nodes", "edges", "metadata"],
                "properties": {
                    "roadmap_id": {"type": "string"},
                    "title": {"type": "string"},
                    "nodes": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["id", "title", "description", "prerequisites", "estimated_hours", "position", "difficulty"],
                            "properties": {
                                "id": {"type": "string"},
                                "title": {"type": "string"},
                                "description": {"type": "string"},
                                "prerequisites": {"type": "array"},
                                "estimated_hours": {"type": "number"},
                                "position": {"type": "object"},
                                "difficulty": {"type": "string"},
                                "resources": {"type": "array"}
                            }
                        }
                    },
                    "edges": {"type": "array"},
                    "metadata": {"type": "object"}
                }
            }

            # Generate roadmap using LLM
            ai_response = await llm_client.generate_json_completion(
                prompt=enhanced_prompt,
                expected_schema=roadmap_schema,
                max_tokens=4000,
                temperature=0.7
            )

            # Process and validate the generated roadmap
            processed_roadmap = await self._process_generated_roadmap(
                ai_response,
                request.target_hours
            )

            # Validate the roadmap structure
            validation_result = await self.validate_roadmap(
                RoadmapValidationRequest(
                    nodes=processed_roadmap["nodes"],
                    edges=processed_roadmap["edges"],
                    validation_rules=["no_cycles", "connected_graph", "reasonable_hours"]
                )
            )

            # Auto-fix critical issues if possible
            if not validation_result.is_valid:
                processed_roadmap = await self._auto_fix_roadmap(
                    processed_roadmap,
                    validation_result.issues
                )

            # Create response
            roadmap_id = str(uuid4())
            response = RoadmapGenerationResponse(
                id=roadmap_id,
                roadmap_id=roadmap_id,
                title=processed_roadmap["title"],
                nodes=processed_roadmap["nodes"],
                edges=processed_roadmap["edges"],
                metadata=processed_roadmap["metadata"],
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )

            # Cache the result
            self.roadmap_cache[cache_key] = response

            logger.info(
                "Roadmap generation completed",
                extra={
                    "roadmap_id": roadmap_id,
                    "node_count": len(processed_roadmap["nodes"]),
                    "edge_count": len(processed_roadmap["edges"]),
                    "total_hours": processed_roadmap["metadata"].get("total_hours", 0),
                    "processing_time": response.processing_time_seconds
                }
            )

            return response

        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                "Roadmap generation failed",
                extra={
                    "error": str(e),
                    "processing_time": processing_time,
                    "course_title": request.course_title
                }
            )
            raise

    async def validate_roadmap(
        self,
        request: RoadmapValidationRequest
    ) -> RoadmapValidationResponse:
        """
        Validate a roadmap structure.

        Args:
            request: Roadmap validation request

        Returns:
            Validation response with issues and suggestions
        """
        start_time = datetime.utcnow()

        try:
            logger.info(
                "Starting roadmap validation",
                extra={
                    "node_count": len(request.nodes),
                    "edge_count": len(request.edges),
                    "validation_rules": request.validation_rules
                }
            )

            issues = []
            is_valid = True

            # Run validation rules
            for rule in request.validation_rules:
                rule_issues = await self._apply_validation_rule(rule, request.nodes, request.edges)
                issues.extend(rule_issues)
                if any(issue.severity == "error" for issue in rule_issues):
                    is_valid = False

            # Calculate quality metrics
            metrics = GraphAnalyzer.calculate_graph_metrics(request.nodes, request.edges)

            # Generate suggestions
            suggestions = self._generate_suggestions(request.nodes, request.edges, metrics)

            response = RoadmapValidationResponse(
                id=str(uuid4()),
                is_valid=is_valid,
                issues=issues,
                suggestions=suggestions,
                metrics=metrics,
                processing_time_seconds=(datetime.utcnow() - start_time).total_seconds()
            )

            logger.info(
                "Roadmap validation completed",
                extra={
                    "is_valid": is_valid,
                    "issue_count": len(issues),
                    "processing_time": response.processing_time_seconds
                }
            )

            return response

        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                "Roadmap validation failed",
                extra={
                    "error": str(e),
                    "processing_time": processing_time
                }
            )
            raise

    async def _gather_search_context(
        self,
        request: RoadmapGenerationRequest
    ) -> str:
        """Gather additional context using search APIs."""
        if not settings.search_api_url or not settings.search_api_key:
            return ""

        try:
            # This would implement actual search API calls
            # For now, return a placeholder
            search_query = f"{request.course_title} {request.custom_input} learning curriculum 2024"

            logger.info(f"Would search for: {search_query}")

            # Placeholder context
            return f"Current industry trends and best practices for {request.course_title} learning"

        except Exception as e:
            logger.warning(f"Search context gathering failed: {e}")
            return ""

    async def _process_generated_roadmap(
        self,
        ai_response: Dict[str, Any],
        target_hours: Optional[int]
    ) -> Dict[str, Any]:
        """Process and enhance the generated roadmap."""
        # Process nodes
        processed_nodes = []
        total_hours = 0

        for i, node_data in enumerate(ai_response.get("nodes", [])):
            try:
                # Ensure proper positioning if not provided
                if "position" not in node_data or not node_data["position"]:
                    node_data["position"] = self._calculate_node_position(i, len(ai_response["nodes"]))

                # Validate and adjust estimated hours
                estimated_hours = node_data.get("estimated_hours", 4.0)
                if estimated_hours < 0.5:
                    estimated_hours = 0.5
                elif estimated_hours > 40:
                    estimated_hours = 40.0

                node = GeneratedNode(
                    id=node_data.get("id", f"node_{uuid4().hex[:8]}"),
                    title=node_data["title"],
                    description=node_data["description"],
                    prerequisites=node_data.get("prerequisites", []),
                    estimated_hours=estimated_hours,
                    position=node_data["position"],
                    difficulty=node_data.get("difficulty", "medium"),
                    resources=node_data.get("resources", [])
                )

                processed_nodes.append(node)
                total_hours += estimated_hours

            except Exception as e:
                logger.warning(f"Failed to process node {i}: {e}")
                continue

        # Adjust hours if target is specified
        if target_hours and total_hours > 0:
            scaling_factor = target_hours / total_hours
            for node in processed_nodes:
                node.estimated_hours = max(0.5, node.estimated_hours * scaling_factor)

        # Process edges
        processed_edges = []
        for edge_data in ai_response.get("edges", []):
            try:
                edge = RoadmapEdge(
                    from_node=edge_data["from"],
                    to_node=edge_data["to"],
                    relationship_type=edge_data.get("type", "prerequisite")
                )
                processed_edges.append(edge)
            except Exception as e:
                logger.warning(f"Failed to process edge: {e}")
                continue

        # Enhanced metadata
        metadata = ai_response.get("metadata", {})
        metadata.update({
            "total_nodes": len(processed_nodes),
            "total_hours": sum(node.estimated_hours for node in processed_nodes),
            "difficulty_levels": self._calculate_difficulty_distribution(processed_nodes),
            "generated_at": datetime.utcnow().isoformat(),
            "validation_status": "pending"
        })

        return {
            "title": ai_response.get("title", "Generated Learning Roadmap"),
            "nodes": processed_nodes,
            "edges": processed_edges,
            "metadata": metadata
        }

    def _calculate_node_position(self, index: int, total_nodes: int) -> Dict[str, float]:
        """Calculate node position for visualization."""
        import math

        # Arrange nodes in a grid or circular pattern
        if total_nodes <= 6:
            # Linear arrangement for small numbers
            return {"x": 100 + index * 200, "y": 100}
        else:
            # Circular arrangement for larger numbers
            angle = (2 * math.pi * index) / total_nodes
            radius = max(200, total_nodes * 30)
            x = 400 + radius * math.cos(angle)
            y = 300 + radius * math.sin(angle)
            return {"x": x, "y": y}

    def _calculate_difficulty_distribution(self, nodes: List[GeneratedNode]) -> Dict[str, int]:
        """Calculate difficulty distribution."""
        distribution = {"easy": 0, "medium": 0, "hard": 0}
        for node in nodes:
            difficulty = node.difficulty.lower()
            if difficulty in distribution:
                distribution[difficulty] += 1
        return distribution

    async def _apply_validation_rule(
        self,
        rule: str,
        nodes: List[GeneratedNode],
        edges: List[RoadmapEdge]
    ) -> List[ValidationIssue]:
        """Apply a specific validation rule."""
        issues = []

        if rule == "no_cycles":
            cycles = GraphAnalyzer.detect_cycles(nodes, edges)
            for cycle in cycles:
                issues.append(ValidationIssue(
                    severity="error",
                    message=f"Circular dependency detected: {' -> '.join(cycle)}",
                    affected_nodes=cycle,
                    suggestion="Remove one of the dependencies to break the cycle"
                ))

        elif rule == "connected_graph":
            components = GraphAnalyzer.find_disconnected_components(nodes, edges)
            if len(components) > 1:
                for i, component in enumerate(components[1:], 1):
                    issues.append(ValidationIssue(
                        severity="warning",
                        message=f"Disconnected component found: {', '.join(component)}",
                        affected_nodes=component,
                        suggestion="Add prerequisites to connect this component to the main graph"
                    ))

        elif rule == "reasonable_hours":
            for node in nodes:
                if node.estimated_hours < 0.5:
                    issues.append(ValidationIssue(
                        severity="warning",
                        message=f"Node '{node.title}' has very low estimated hours ({node.estimated_hours})",
                        affected_nodes=[node.id],
                        suggestion="Consider combining with another node or increasing the estimate"
                    ))
                elif node.estimated_hours > 40:
                    issues.append(ValidationIssue(
                        severity="warning",
                        message=f"Node '{node.title}' has very high estimated hours ({node.estimated_hours})",
                        affected_nodes=[node.id],
                        suggestion="Consider breaking this node into smaller, more manageable units"
                    ))

        return issues

    def _generate_suggestions(
        self,
        nodes: List[GeneratedNode],
        edges: List[RoadmapEdge],
        metrics: Dict[str, float]
    ) -> List[str]:
        """Generate improvement suggestions."""
        suggestions = []

        # Based on connectivity
        if metrics.get("connectivity_score", 1.0) < 0.8:
            suggestions.append("Consider adding more prerequisite relationships to improve learning flow")

        # Based on balance
        if metrics.get("balance_score", 1.0) < 0.7:
            suggestions.append("Balance the estimated hours across nodes for better pacing")

        # Based on complexity
        complexity = metrics.get("complexity_score", 0.5)
        if complexity < 0.3:
            suggestions.append("The roadmap might be too linear - consider adding parallel learning paths")
        elif complexity > 0.8:
            suggestions.append("The roadmap might be too complex - consider simplifying dependencies")

        # General suggestions
        if len(nodes) < 5:
            suggestions.append("Consider adding more detailed intermediate steps")
        elif len(nodes) > 20:
            suggestions.append("Consider grouping related topics into larger modules")

        return suggestions

    async def _auto_fix_roadmap(
        self,
        roadmap: Dict[str, Any],
        issues: List[ValidationIssue]
    ) -> Dict[str, Any]:
        """Attempt to automatically fix critical roadmap issues."""
        # For now, just log the issues and return unchanged
        # In production, this would implement actual fixes
        logger.info(f"Auto-fix would address {len(issues)} issues")
        return roadmap

    def _create_cache_key(self, request: RoadmapGenerationRequest) -> str:
        """Create a cache key for roadmap generation."""
        key_components = [
            request.course_title,
            request.course_description,
            request.custom_input or "",
            str(request.target_hours or ""),
            request.difficulty_level,
            str(request.search_enabled)
        ]
        return f"roadmap_{hash('|'.join(key_components))}"

    def get_cached_roadmap(self, cache_key: str) -> Optional[RoadmapGenerationResponse]:
        """Get a cached roadmap."""
        return self.roadmap_cache.get(cache_key)

    def clear_cache(self) -> Dict[str, int]:
        """Clear the roadmap cache."""
        count = len(self.roadmap_cache)
        self.roadmap_cache.clear()
        return {"cleared_roadmaps": count}


# Global roadmap service instance
ai_roadmap_service = AIRoadmapService()