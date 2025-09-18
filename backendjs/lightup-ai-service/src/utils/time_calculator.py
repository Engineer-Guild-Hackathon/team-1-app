"""Time calculation utilities for study planning."""

import logging
from datetime import datetime, date, timedelta
from typing import List, Dict, Tuple, Optional
from collections import defaultdict

from src.models.common import NodeProgress, KnowledgeNodeInfo

logger = logging.getLogger(__name__)


class TimeCalculator:
    """Utility class for time-related calculations in study planning."""

    @staticmethod
    def calculate_available_study_days(
        start_date: str,
        target_days: int,
        exclude_weekends: bool = False
    ) -> List[str]:
        """
        Calculate available study days within the target period.

        Args:
            start_date: Start date in YYYY-MM-DD format
            target_days: Target number of study days
            exclude_weekends: Whether to exclude weekends

        Returns:
            List of study dates in YYYY-MM-DD format
        """
        try:
            current_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        except ValueError:
            current_date = date.today()

        study_days = []
        days_added = 0
        calendar_days = 0

        while days_added < target_days and calendar_days < target_days * 2:  # Safety limit
            if not exclude_weekends or current_date.weekday() < 5:  # Monday = 0, Sunday = 6
                study_days.append(current_date.strftime("%Y-%m-%d"))
                days_added += 1

            current_date += timedelta(days=1)
            calendar_days += 1

        return study_days

    @staticmethod
    def estimate_completion_time(
        nodes: List[KnowledgeNodeInfo],
        user_progress: List[NodeProgress],
        daily_hours: float,
        efficiency_factor: float = 0.8
    ) -> Dict[str, any]:
        """
        Estimate time required to complete remaining nodes.

        Args:
            nodes: List of knowledge nodes
            user_progress: Current user progress
            daily_hours: Available daily study hours
            efficiency_factor: Factor to account for breaks, distractions, etc.

        Returns:
            Dictionary with time estimates
        """
        progress_lookup = {p.node_id: p for p in user_progress}
        remaining_hours = 0
        review_hours = 0
        completed_nodes = 0

        for node in nodes:
            progress = progress_lookup.get(node.id)

            if not progress or progress.status == "not_started":
                remaining_hours += node.estimated_hours
            elif progress.status == "next":
                # Assume some progress has been made
                remaining_hours += node.estimated_hours * 0.7
            elif progress.status == "needs_review":
                # Review typically takes 30% of original time
                review_hours += node.estimated_hours * 0.3
            elif progress.status == "completed":
                completed_nodes += 1

        total_remaining_hours = (remaining_hours + review_hours) * efficiency_factor
        effective_daily_hours = daily_hours * efficiency_factor

        estimated_days = int(total_remaining_hours / effective_daily_hours) + 1

        return {
            "total_remaining_hours": total_remaining_hours,
            "estimated_days": estimated_days,
            "completed_nodes": completed_nodes,
            "remaining_nodes": len(nodes) - completed_nodes,
            "review_hours": review_hours,
            "new_learning_hours": remaining_hours * efficiency_factor
        }

    @staticmethod
    def distribute_study_time(
        nodes: List[KnowledgeNodeInfo],
        available_days: List[str],
        daily_hours: float,
        user_progress: List[NodeProgress],
        priority_weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Dict[str, float]]:
        """
        Distribute study time across nodes and days.

        Args:
            nodes: List of knowledge nodes
            available_days: Available study days
            daily_hours: Daily available hours
            user_progress: Current progress
            priority_weights: Optional priority weights for nodes

        Returns:
            Dictionary mapping date -> node_id -> hours
        """
        if not available_days:
            return {}

        progress_lookup = {p.node_id: p for p in user_progress}
        priority_weights = priority_weights or {}

        # Calculate remaining time for each node
        node_time_requirements = {}
        for node in nodes:
            progress = progress_lookup.get(node.id)

            if not progress or progress.status == "not_started":
                required_time = node.estimated_hours
            elif progress.status == "next":
                required_time = node.estimated_hours * 0.7
            elif progress.status == "needs_review":
                required_time = node.estimated_hours * 0.3
            else:  # completed
                required_time = 0

            if required_time > 0:
                weight = priority_weights.get(node.id, 1.0)
                node_time_requirements[node.id] = required_time * weight

        # Distribute time across days
        total_available_hours = len(available_days) * daily_hours
        total_required_hours = sum(node_time_requirements.values())

        if total_required_hours == 0:
            return {}

        # Scale down if we don't have enough time
        scaling_factor = min(1.0, total_available_hours / total_required_hours)

        schedule = defaultdict(dict)
        remaining_requirements = node_time_requirements.copy()

        for day in available_days:
            daily_remaining = daily_hours

            # Sort nodes by priority and remaining time
            available_nodes = [
                (node_id, time_needed)
                for node_id, time_needed in remaining_requirements.items()
                if time_needed > 0
            ]

            available_nodes.sort(key=lambda x: (-priority_weights.get(x[0], 1.0), x[1]))

            for node_id, time_needed in available_nodes:
                if daily_remaining <= 0:
                    break

                # Allocate time for this node on this day
                allocated_time = min(
                    daily_remaining,
                    time_needed * scaling_factor,
                    2.0  # Maximum 2 hours per node per day for better learning
                )

                if allocated_time >= 0.25:  # Minimum 15 minutes
                    schedule[day][node_id] = allocated_time
                    remaining_requirements[node_id] -= allocated_time
                    daily_remaining -= allocated_time

        return dict(schedule)

    @staticmethod
    def calculate_study_intensity(
        daily_hours: float,
        total_nodes: int,
        target_days: int
    ) -> Dict[str, any]:
        """
        Calculate study intensity metrics.

        Args:
            daily_hours: Daily study hours
            total_nodes: Total number of nodes
            target_days: Target completion days

        Returns:
            Dictionary with intensity metrics
        """
        total_weekly_hours = daily_hours * 7
        nodes_per_week = (total_nodes / target_days) * 7

        intensity_level = "low"
        if daily_hours >= 4:
            intensity_level = "very_high"
        elif daily_hours >= 3:
            intensity_level = "high"
        elif daily_hours >= 2:
            intensity_level = "medium"
        elif daily_hours >= 1:
            intensity_level = "moderate"

        sustainability_score = 1.0
        if daily_hours > 6:
            sustainability_score = 0.3
        elif daily_hours > 4:
            sustainability_score = 0.6
        elif daily_hours > 3:
            sustainability_score = 0.8

        return {
            "intensity_level": intensity_level,
            "daily_hours": daily_hours,
            "weekly_hours": total_weekly_hours,
            "nodes_per_week": nodes_per_week,
            "sustainability_score": sustainability_score,
            "recommended_breaks": max(1, int(daily_hours / 1.5)),
            "suggested_session_length": min(90, daily_hours * 60 / max(1, int(daily_hours / 1.5)))
        }

    @staticmethod
    def optimize_daily_schedule(
        daily_hours: float,
        node_allocations: Dict[str, float],
        break_interval: int = 25,
        max_session_length: int = 90
    ) -> List[Dict[str, any]]:
        """
        Optimize the daily schedule with proper breaks and session management.

        Args:
            daily_hours: Total daily study hours
            node_allocations: Node ID -> allocated hours
            break_interval: Break interval in minutes (Pomodoro style)
            max_session_length: Maximum session length in minutes

        Returns:
            List of study sessions with timing
        """
        if not node_allocations:
            return []

        sessions = []
        total_minutes = daily_hours * 60

        # Convert hours to minutes for easier calculation
        node_minutes = {node_id: hours * 60 for node_id, hours in node_allocations.items()}

        current_time = 0
        session_count = 0

        # Sort nodes by allocated time (largest first for better distribution)
        sorted_nodes = sorted(node_minutes.items(), key=lambda x: -x[1])

        for node_id, allocated_minutes in sorted_nodes:
            remaining_minutes = allocated_minutes

            while remaining_minutes > 0 and current_time < total_minutes:
                # Calculate session length
                session_length = min(
                    remaining_minutes,
                    max_session_length,
                    break_interval,
                    total_minutes - current_time
                )

                if session_length >= 15:  # Minimum 15 minutes per session
                    sessions.append({
                        "session_id": session_count + 1,
                        "node_id": node_id,
                        "start_minute": current_time,
                        "duration_minutes": int(session_length),
                        "activity_type": TimeCalculator._determine_activity_type(session_length)
                    })

                    remaining_minutes -= session_length
                    current_time += session_length
                    session_count += 1

                    # Add break if not the last session and we have time
                    if remaining_minutes > 0 and current_time < total_minutes - 5:
                        break_duration = min(10, (total_minutes - current_time) // 10)
                        current_time += break_duration

                else:
                    break  # Not enough time for meaningful session

        return sessions

    @staticmethod
    def _determine_activity_type(session_length: float) -> str:
        """Determine appropriate activity type based on session length."""
        if session_length >= 60:
            return "deep_learning"
        elif session_length >= 30:
            return "focused_study"
        elif session_length >= 15:
            return "review_practice"
        else:
            return "quick_review"

    @staticmethod
    def calculate_weekly_breakdown(
        schedule: Dict[str, Dict[str, float]],
        start_date: str
    ) -> Dict[str, float]:
        """
        Calculate weekly breakdown of study hours.

        Args:
            schedule: Date -> node -> hours schedule
            start_date: Start date for week calculation

        Returns:
            Dictionary mapping week identifier to total hours
        """
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
        except ValueError:
            start = date.today()

        weekly_hours = defaultdict(float)

        for date_str, node_hours in schedule.items():
            try:
                current_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                days_diff = (current_date - start).days
                week_number = days_diff // 7 + 1

                week_key = f"week_{week_number}"
                daily_total = sum(node_hours.values())
                weekly_hours[week_key] += daily_total

            except ValueError:
                continue

        return dict(weekly_hours)

    @staticmethod
    def estimate_realistic_completion(
        target_days: int,
        daily_hours: float,
        total_required_hours: float,
        buffer_factor: float = 1.2
    ) -> Dict[str, any]:
        """
        Estimate realistic completion time accounting for various factors.

        Args:
            target_days: Originally requested target days
            daily_hours: Daily available hours
            total_required_hours: Total hours needed
            buffer_factor: Buffer factor for unexpected delays

        Returns:
            Realistic completion estimates
        """
        # Account for learning efficiency (typically 70-80% effective)
        effective_daily_hours = daily_hours * 0.75

        # Calculate minimum days needed
        minimum_days = int((total_required_hours * buffer_factor) / effective_daily_hours) + 1

        # Determine if target is realistic
        is_realistic = target_days >= minimum_days

        recommended_days = max(target_days, minimum_days)
        recommended_daily_hours = (total_required_hours * buffer_factor) / recommended_days

        return {
            "is_target_realistic": is_realistic,
            "minimum_days_needed": minimum_days,
            "recommended_days": recommended_days,
            "recommended_daily_hours": recommended_daily_hours,
            "buffer_days": max(0, recommended_days - minimum_days),
            "intensity_warning": daily_hours > 4,
            "sustainability_score": min(1.0, 3.0 / max(1.0, recommended_daily_hours))
        }