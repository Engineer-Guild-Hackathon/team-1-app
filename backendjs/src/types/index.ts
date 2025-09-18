import { z } from 'zod';

// Common types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface RequestWithId extends Request {
  requestId: string;
}

// Course types
export interface CourseInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  isPreset: boolean;
  createdAt: string;
}

// Roadmap types
export interface NodePosition {
  x: number;
  y: number;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  estimatedHours: number;
  position: NodePosition;
}

export interface RoadmapEdge {
  from: string;
  to: string;
  type: 'prerequisite';
}

export interface RoadmapData {
  id: string;
  courseId: string;
  title: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

// Progress types
export type NodeProgressStatus = 'not_started' | 'next' | 'completed' | 'needs_review';

export interface NodeProgress {
  nodeId: string;
  status: NodeProgressStatus;
  masteryScore: number;
  lastAssessed?: string;
  studyTimeMinutes: number;
}

export interface ProgressSummary {
  totalNodes: number;
  completedNodes: number;
  nextNodes: number;
  needsReviewNodes: number;
}

// Assessment types
export type QuestionType = 'multiple_choice' | 'short_answer' | 'true_false';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface AssessmentQuestion {
  id: string;
  nodeId: string;
  question: string;
  type: QuestionType;
  options?: string[];
  points: number;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string | string[];
}

export interface NodeScore {
  nodeId: string;
  score: number;
  feedback: string;
  recommendedAction: 'continue' | 'review' | 'master';
}

// Study Plan types
export interface StudyPlanPreferences {
  startDate?: string;
  weekends?: boolean;
  intensiveMode?: boolean;
}

export interface StudyActivity {
  nodeId: string;
  activityType: 'learn' | 'review' | 'practice';
  estimatedMinutes: number;
  description: string;
}

export interface StudyDay {
  day: number;
  date: string;
  studyHours: number;
  nodes: StudyActivity[];
  dailyGoal: string;
}

export interface StudyPlanSummary {
  totalDays: number;
  totalHours: number;
  averageHoursPerDay: number;
  estimatedCompletion: string;
}

// Dashboard types
export interface HeatmapData {
  date: string;
  value: number;
}

export interface ProgressStats {
  completionPercentage: number;
  totalStudyHours: number;
  averageDailyMinutes: number;
  streak: number;
  lastActiveDate: string;
}

export interface NodeStats {
  mastered: number;
  inProgress: number;
  notStarted: number;
  needsReview: number;
}

export interface WeeklyTrend {
  week: string;
  minutes: number;
}

// AI Service types
export interface AIRoadmapRequest {
  courseTitle: string;
  courseDescription: string;
  customInput?: string;
  searchEnabled?: boolean;
}

export interface AIAssessmentRequest {
  nodeIds: string[];
  nodeDescriptions: string[];
  difficultyLevel: DifficultyLevel;
}

export interface AIStudyPlanRequest {
  roadmap: RoadmapData;
  progress: NodeProgress[];
  targetDays: number;
  dailyHours: number;
  preferences?: StudyPlanPreferences;
}