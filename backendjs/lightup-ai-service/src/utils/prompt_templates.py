"""Prompt templates for various AI tasks."""

from typing import Dict, List, Any
from src.models.common import KnowledgeNodeInfo, NodeProgress


class PromptTemplates:
    """Collection of prompt templates for AI tasks."""

    @staticmethod
    def assessment_generation_prompt(
        nodes: List[KnowledgeNodeInfo],
        user_progress: List[NodeProgress],
        difficulty_level: str,
        question_count: int,
        focus_areas: List[str] = None
    ) -> str:
        """Generate prompt for assessment generation."""

        node_info = "\n".join([
            f"Node ID: {node.id}\n"
            f"Title: {node.title}\n"
            f"Description: {node.description}\n"
            f"Prerequisites: {', '.join(node.prerequisites) if node.prerequisites else 'None'}\n"
            f"Estimated Hours: {node.estimated_hours}\n"
            f"User Status: {node.current_user_status}\n"
            for node in nodes
        ])

        progress_info = "\n".join([
            f"Node {progress.node_id}: {progress.status} (Score: {progress.mastery_score}/100, "
            f"Study Time: {progress.study_time_minutes} minutes)"
            for progress in user_progress
        ])

        focus_text = f"Focus especially on these areas: {', '.join(focus_areas)}" if focus_areas else ""

        return f"""
You are a professional educational assessment expert. Generate high-quality assessment questions based on the provided knowledge nodes.

KNOWLEDGE NODES:
{node_info}

USER PROGRESS:
{progress_info}

REQUIREMENTS:
- Generate exactly {question_count} questions covering all important concepts
- Difficulty level: {difficulty_level}
- Include multiple question types: multiple_choice, short_answer, true_false
- Each question must reference a specific node_id
- Provide correct answers and detailed explanations
- Include keywords for automated scoring
{focus_text}

RESPONSE FORMAT (JSON):
{{
    "questions": [
        {{
            "id": "unique_question_id",
            "node_id": "corresponding_node_id",
            "question": "The question text",
            "question_type": "multiple_choice|short_answer|true_false",
            "options": ["option1", "option2", "option3", "option4"],  // for multiple_choice only
            "correct_answer": "the correct answer",
            "points": 10,
            "difficulty": "{difficulty_level}",
            "explanation": "Detailed explanation of the answer",
            "keywords": ["keyword1", "keyword2"]
        }}
    ],
    "estimated_minutes": 20
}}

Generate diverse, challenging questions that accurately assess understanding of the concepts.
"""

    @staticmethod
    def assessment_evaluation_prompt(
        questions: List[Dict[str, Any]],
        user_answers: List[Dict[str, Any]]
    ) -> str:
        """Generate prompt for assessment evaluation."""

        qa_pairs = []
        for question in questions:
            user_answer = next(
                (ans for ans in user_answers if ans['question_id'] == question['id']),
                None
            )

            qa_pairs.append(f"""
Question ID: {question['id']}
Node ID: {question['node_id']}
Question: {question['question']}
Type: {question['question_type']}
Correct Answer: {question.get('correct_answer', 'N/A')}
User Answer: {user_answer['answer'] if user_answer else 'Not answered'}
Points: {question['points']}
Keywords: {', '.join(question.get('keywords', []))}
""")

        qa_text = "\n".join(qa_pairs)

        return f"""
You are an intelligent learning assistant. Evaluate the student's answers and provide detailed feedback.

QUESTIONS AND ANSWERS:
{qa_text}

EVALUATION REQUIREMENTS:
1. Score each answer (0-100% of points)
2. Provide specific feedback for each answer
3. Assess knowledge node mastery levels
4. Give actionable learning recommendations

RESPONSE FORMAT (JSON):
{{
    "question_scores": [
        {{
            "question_id": "q_id",
            "score": 8.5,
            "max_score": 10,
            "feedback": "Detailed feedback on the answer",
            "is_correct": true
        }}
    ],
    "node_scores": [
        {{
            "node_id": "node_id",
            "score": 85,
            "feedback": "Overall understanding of this topic",
            "recommended_action": "continue|review|master",
            "areas_to_improve": ["specific area 1", "specific area 2"]
        }}
    ],
    "total_score": 85.5,
    "max_score": 100,
    "percentage": 85.5,
    "overall_feedback": "Overall performance summary",
    "study_recommendations": ["Specific recommendation 1", "Specific recommendation 2"]
}}

Provide constructive feedback that helps the student improve their understanding.
"""

    @staticmethod
    def study_plan_generation_prompt(
        course_info: Dict[str, Any],
        roadmap_data: Dict[str, Any],
        user_progress: List[NodeProgress],
        target_days: int,
        daily_hours: float,
        start_date: str = None,
        preferences: Dict[str, Any] = None
    ) -> str:
        """Generate prompt for study plan generation."""

        node_info = "\n".join([
            f"- {node['id']}: {node['title']} ({node['estimated_hours']}h) - "
            f"Prerequisites: {', '.join(node['prerequisites']) if node['prerequisites'] else 'None'}"
            for node in roadmap_data.get('nodes', [])
        ])

        progress_info = "\n".join([
            f"- {progress.node_id}: {progress.status} (Score: {progress.mastery_score}/100)"
            for progress in user_progress
        ])

        preferences_text = ""
        if preferences:
            preferences_text = f"""
USER PREFERENCES:
- Learning Style: {preferences.get('learning_style', 'Not specified')}
- Intensive Mode: {preferences.get('intensive_mode', False)}
- Break Intervals: {preferences.get('break_intervals', 25)} minutes
- Preferred Times: {', '.join(preferences.get('preferred_time_slots', [])) or 'Not specified'}
"""

        return f"""
You are a professional learning planner. Create a detailed, personalized study plan based on the provided information.

COURSE INFORMATION:
{course_info}

KNOWLEDGE ROADMAP:
{node_info}

CURRENT PROGRESS:
{progress_info}

TIME CONSTRAINTS:
- Target Days: {target_days}
- Daily Available Hours: {daily_hours}
- Start Date: {start_date or 'Not specified'}

{preferences_text}

REQUIREMENTS:
1. Follow the prerequisite dependencies in the roadmap
2. Adapt to user's current progress (skip completed nodes, focus on needs_review)
3. Distribute workload evenly across available time
4. Create specific daily activities with realistic time estimates
5. Include variety in activity types (learn, review, practice, assess)
6. Assign priority levels and color themes for organization

RESPONSE FORMAT (JSON):
{{
    "daily_schedule": [
        {{
            "day": 1,
            "date": "2024-01-01",
            "total_study_minutes": 120,
            "activities": [
                {{
                    "node_id": "node_id",
                    "activity_type": "learn|review|practice|assess",
                    "estimated_minutes": 60,
                    "description": "Specific activity description",
                    "priority": "high|medium|low",
                    "resources": ["resource1", "resource2"]
                }}
            ],
            "daily_goal": "Clear, achievable goal for the day",
            "color_theme": "#4CAF50",
            "milestones": ["Key milestone for this day"]
        }}
    ],
    "summary": {{
        "total_days": {target_days},
        "total_hours": {target_days * daily_hours},
        "nodes_to_complete": 10,
        "estimated_completion_date": "2024-01-30",
        "difficulty_distribution": {{"easy": 3, "medium": 5, "hard": 2}},
        "weekly_breakdown": {{"week_1": 15, "week_2": 15}}
    }},
    "recommendations": [
        "Take regular breaks every 25 minutes",
        "Review previous day's material before starting new topics"
    ]
}}

Create a balanced, achievable plan that maximizes learning efficiency while respecting time constraints.
"""

    @staticmethod
    def roadmap_generation_prompt(
        course_title: str,
        course_description: str,
        custom_input: str = None,
        target_hours: int = None,
        difficulty_level: str = "beginner"
    ) -> str:
        """Generate prompt for roadmap generation."""

        custom_text = f"\nCustom Requirements: {custom_input}" if custom_input else ""
        hours_text = f"\nTarget Learning Hours: {target_hours}" if target_hours else ""

        return f"""
You are an expert curriculum designer. Create a comprehensive learning roadmap for the specified course.

COURSE DETAILS:
Title: {course_title}
Description: {course_description}
Difficulty Level: {difficulty_level}{custom_text}{hours_text}

REQUIREMENTS:
1. Create 8-15 knowledge nodes covering all essential topics
2. Establish logical prerequisite relationships
3. Estimate realistic learning hours for each node
4. Arrange nodes in a learnable sequence
5. Include beginner to advanced progression
6. Provide clear, actionable descriptions

RESPONSE FORMAT (JSON):
{{
    "roadmap_id": "unique_roadmap_id",
    "title": "{course_title} Learning Path",
    "nodes": [
        {{
            "id": "unique_node_id",
            "title": "Node Title",
            "description": "Detailed description of what will be learned",
            "prerequisites": ["prerequisite_node_id1", "prerequisite_node_id2"],
            "estimated_hours": 8.0,
            "position": {{"x": 100, "y": 100}},
            "difficulty": "easy|medium|hard",
            "resources": ["recommended_resource_1", "recommended_resource_2"]
        }}
    ],
    "edges": [
        {{
            "from": "prerequisite_node_id",
            "to": "dependent_node_id",
            "type": "prerequisite"
        }}
    ],
    "metadata": {{
        "total_nodes": 10,
        "total_hours": 50.0,
        "difficulty_levels": {{"easy": 4, "medium": 4, "hard": 2}}
    }}
}}

Create a well-structured, progressive learning path that builds knowledge systematically.
"""

    @staticmethod
    def plan_adjustment_prompt(
        original_plan: Dict[str, Any],
        feedback: Dict[str, Any],
        remaining_days: int
    ) -> str:
        """Generate prompt for study plan adjustment."""

        feedback_text = f"""
FEEDBACK RECEIVED:
- Completed Days: {', '.join(map(str, feedback.get('completed_days', [])))}
- Time Spent: {feedback.get('time_spent_minutes', {})}
- Difficulty Issues: {feedback.get('difficulty_feedback', {})}
- Requested Adjustments: {', '.join(feedback.get('preferred_adjustments', []))}
"""

        return f"""
You are an adaptive learning planner. Adjust the existing study plan based on user feedback and progress.

ORIGINAL PLAN SUMMARY:
{original_plan.get('summary', {})}

{feedback_text}

REMAINING TIME:
- Days Left: {remaining_days}

ADJUSTMENT REQUIREMENTS:
1. Analyze user feedback and progress patterns
2. Identify areas that need more/less time
3. Adjust difficulty levels based on feedback
4. Redistribute remaining content across available days
5. Maintain learning coherence and prerequisite order

RESPONSE FORMAT (JSON):
{{
    "adjusted_plan_id": "plan_id_v2",
    "changes_made": [
        "Reduced daily study time from 2h to 1.5h",
        "Added more practice exercises for difficult topics"
    ],
    "updated_schedule": [
        // Updated daily schedule following same format as original
    ],
    "impact_analysis": "Description of how changes affect the overall plan"
}}

Make thoughtful adjustments that improve the learning experience while maintaining plan integrity.
"""