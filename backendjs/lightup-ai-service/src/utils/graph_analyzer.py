"""Graph analysis utilities for roadmap validation and optimization."""

import logging
from typing import Dict, List, Set, Tuple, Optional
from collections import defaultdict, deque

from src.models.roadmap import GeneratedNode, RoadmapEdge
from src.models.common import NodeProgress

logger = logging.getLogger(__name__)


class GraphAnalyzer:
    """Utility class for analyzing knowledge graphs and roadmaps."""

    @staticmethod
    def detect_cycles(nodes: List[GeneratedNode], edges: List[RoadmapEdge]) -> List[List[str]]:
        """
        Detect cycles in the roadmap graph.

        Args:
            nodes: List of knowledge nodes
            edges: List of edges representing dependencies

        Returns:
            List of cycles found, each cycle is a list of node IDs
        """
        # Build adjacency list
        graph = defaultdict(list)
        for edge in edges:
            graph[edge.from_node].append(edge.to_node)

        # Track visited nodes and recursion stack
        visited = set()
        rec_stack = set()
        cycles = []

        def dfs(node: str, path: List[str]) -> None:
            visited.add(node)
            rec_stack.add(node)
            path.append(node)

            for neighbor in graph[node]:
                if neighbor not in visited:
                    dfs(neighbor, path.copy())
                elif neighbor in rec_stack:
                    # Found a cycle
                    cycle_start = path.index(neighbor)
                    cycle = path[cycle_start:] + [neighbor]
                    cycles.append(cycle)

            rec_stack.remove(node)

        # Check all nodes
        node_ids = {node.id for node in nodes}
        for node_id in node_ids:
            if node_id not in visited:
                dfs(node_id, [])

        return cycles

    @staticmethod
    def find_disconnected_components(nodes: List[GeneratedNode], edges: List[RoadmapEdge]) -> List[List[str]]:
        """
        Find disconnected components in the roadmap graph.

        Args:
            nodes: List of knowledge nodes
            edges: List of edges

        Returns:
            List of components, each component is a list of node IDs
        """
        # Build undirected adjacency list
        graph = defaultdict(set)
        node_ids = {node.id for node in nodes}

        for edge in edges:
            graph[edge.from_node].add(edge.to_node)
            graph[edge.to_node].add(edge.from_node)

        visited = set()
        components = []

        def dfs(node: str, component: List[str]) -> None:
            visited.add(node)
            component.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    dfs(neighbor, component)

        for node_id in node_ids:
            if node_id not in visited:
                component = []
                dfs(node_id, component)
                components.append(component)

        return components

    @staticmethod
    def calculate_learning_paths(
        nodes: List[GeneratedNode],
        edges: List[RoadmapEdge],
        start_nodes: Optional[List[str]] = None
    ) -> Dict[str, List[str]]:
        """
        Calculate possible learning paths from start nodes.

        Args:
            nodes: List of knowledge nodes
            edges: List of edges
            start_nodes: Starting nodes (nodes with no prerequisites if not specified)

        Returns:
            Dictionary mapping each node to its possible learning paths
        """
        # Build adjacency list (reverse direction for prerequisites)
        prerequisites = defaultdict(list)
        dependents = defaultdict(list)

        for edge in edges:
            prerequisites[edge.to_node].append(edge.from_node)
            dependents[edge.from_node].append(edge.to_node)

        # Find start nodes if not specified
        if start_nodes is None:
            start_nodes = [node.id for node in nodes if not prerequisites[node.id]]

        # Calculate paths using topological ordering
        paths = {}
        in_degree = defaultdict(int)
        node_ids = {node.id for node in nodes}

        # Calculate in-degrees
        for node_id in node_ids:
            in_degree[node_id] = len(prerequisites[node_id])

        # Process nodes in topological order
        queue = deque(start_nodes)
        processed = set()

        while queue:
            current = queue.popleft()
            if current in processed:
                continue

            processed.add(current)

            # Calculate path to current node
            if current in start_nodes:
                paths[current] = [current]
            else:
                # Find the shortest path through prerequisites
                shortest_path = None
                for prereq in prerequisites[current]:
                    if prereq in paths:
                        candidate_path = paths[prereq] + [current]
                        if shortest_path is None or len(candidate_path) < len(shortest_path):
                            shortest_path = candidate_path

                if shortest_path:
                    paths[current] = shortest_path

            # Add dependents to queue
            for dependent in dependents[current]:
                in_degree[dependent] -= 1
                if in_degree[dependent] == 0:
                    queue.append(dependent)

        return paths

    @staticmethod
    def validate_prerequisites(nodes: List[GeneratedNode], edges: List[RoadmapEdge]) -> List[str]:
        """
        Validate that all prerequisites are satisfied.

        Args:
            nodes: List of knowledge nodes
            edges: List of edges

        Returns:
            List of validation errors
        """
        errors = []
        node_ids = {node.id for node in nodes}

        # Check that all prerequisite nodes exist
        for node in nodes:
            for prereq in node.prerequisites:
                if prereq not in node_ids:
                    errors.append(f"Node {node.id} references non-existent prerequisite: {prereq}")

        # Check that edges match node prerequisites
        edge_map = defaultdict(set)
        for edge in edges:
            edge_map[edge.to_node].add(edge.from_node)

        for node in nodes:
            node_prereqs = set(node.prerequisites)
            edge_prereqs = edge_map[node.id]

            if node_prereqs != edge_prereqs:
                errors.append(
                    f"Node {node.id}: prerequisite mismatch between node.prerequisites "
                    f"({node_prereqs}) and edges ({edge_prereqs})"
                )

        return errors

    @staticmethod
    def calculate_critical_path(nodes: List[GeneratedNode], edges: List[RoadmapEdge]) -> Tuple[List[str], float]:
        """
        Calculate the critical path (longest path) through the roadmap.

        Args:
            nodes: List of knowledge nodes
            edges: List of edges

        Returns:
            Tuple of (critical path node IDs, total hours)
        """
        # Build node lookup
        node_lookup = {node.id: node for node in nodes}

        # Build adjacency list
        graph = defaultdict(list)
        in_degree = defaultdict(int)

        for edge in edges:
            graph[edge.from_node].append(edge.to_node)
            in_degree[edge.to_node] += 1

        # Initialize distances
        distances = defaultdict(float)
        predecessors = {}

        # Find starting nodes (no prerequisites)
        start_nodes = [node.id for node in nodes if in_degree[node.id] == 0]

        # Topological sort with longest path calculation
        queue = deque(start_nodes)

        while queue:
            current = queue.popleft()
            current_node = node_lookup[current]

            for neighbor in graph[current]:
                new_distance = distances[current] + current_node.estimated_hours

                if new_distance > distances[neighbor]:
                    distances[neighbor] = new_distance
                    predecessors[neighbor] = current

                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # Find the end node with maximum distance
        max_distance = 0
        end_node = None

        for node_id, distance in distances.items():
            total_distance = distance + node_lookup[node_id].estimated_hours
            if total_distance > max_distance:
                max_distance = total_distance
                end_node = node_id

        # Reconstruct path
        if end_node is None:
            return [], 0

        path = []
        current = end_node

        while current is not None:
            path.append(current)
            current = predecessors.get(current)

        path.reverse()
        return path, max_distance

    @staticmethod
    def suggest_optimal_sequence(
        nodes: List[GeneratedNode],
        edges: List[RoadmapEdge],
        user_progress: List[NodeProgress],
        daily_hours: float
    ) -> List[str]:
        """
        Suggest an optimal learning sequence based on dependencies and user progress.

        Args:
            nodes: List of knowledge nodes
            edges: List of edges
            user_progress: Current user progress
            daily_hours: Available daily study hours

        Returns:
            Optimal sequence of node IDs to study
        """
        # Build node lookup
        node_lookup = {node.id: node for node in nodes}
        progress_lookup = {p.node_id: p for p in user_progress}

        # Build adjacency list
        prerequisites = defaultdict(list)
        for edge in edges:
            prerequisites[edge.to_node].append(edge.from_node)

        # Filter nodes based on current progress
        available_nodes = []
        completed_nodes = set()

        for node in nodes:
            progress = progress_lookup.get(node.id)

            if progress and progress.status == "completed":
                completed_nodes.add(node.id)
            elif progress and progress.status == "needs_review":
                # Prioritize review nodes
                available_nodes.insert(0, node.id)
            elif not progress or progress.status in ["not_started", "next"]:
                # Check if prerequisites are met
                prereqs_met = all(prereq in completed_nodes for prereq in prerequisites[node.id])
                if prereqs_met:
                    available_nodes.append(node.id)

        # Sort by difficulty and estimated hours to create a balanced sequence
        def sort_key(node_id: str) -> Tuple[int, float]:
            node = node_lookup[node_id]
            difficulty_weight = {"easy": 1, "medium": 2, "hard": 3}.get(node.difficulty, 2)
            return (difficulty_weight, node.estimated_hours)

        available_nodes.sort(key=sort_key)

        return available_nodes

    @staticmethod
    def calculate_graph_metrics(nodes: List[GeneratedNode], edges: List[RoadmapEdge]) -> Dict[str, float]:
        """
        Calculate various graph quality metrics.

        Args:
            nodes: List of knowledge nodes
            edges: List of edges

        Returns:
            Dictionary of metric name to value
        """
        metrics = {}

        # Basic counts
        num_nodes = len(nodes)
        num_edges = len(edges)

        if num_nodes == 0:
            return {"error": "No nodes provided"}

        # Connectivity metrics
        components = GraphAnalyzer.find_disconnected_components(nodes, edges)
        metrics["connectivity_score"] = 1.0 - (len(components) - 1) / max(1, num_nodes - 1)

        # Cycle detection
        cycles = GraphAnalyzer.detect_cycles(nodes, edges)
        metrics["acyclic_score"] = 1.0 if not cycles else 0.0

        # Balance metrics
        total_hours = sum(node.estimated_hours for node in nodes)
        avg_hours = total_hours / num_nodes
        hour_variance = sum((node.estimated_hours - avg_hours) ** 2 for node in nodes) / num_nodes
        metrics["balance_score"] = 1.0 / (1.0 + hour_variance / max(1, avg_hours))

        # Complexity metrics
        in_degrees = defaultdict(int)
        out_degrees = defaultdict(int)

        for edge in edges:
            out_degrees[edge.from_node] += 1
            in_degrees[edge.to_node] += 1

        avg_degree = (sum(in_degrees.values()) + sum(out_degrees.values())) / (2 * num_nodes)
        metrics["complexity_score"] = min(1.0, avg_degree / 3.0)  # Normalize to reasonable range

        # Path metrics
        critical_path, critical_hours = GraphAnalyzer.calculate_critical_path(nodes, edges)
        metrics["critical_path_length"] = len(critical_path)
        metrics["critical_path_hours"] = critical_hours

        return metrics