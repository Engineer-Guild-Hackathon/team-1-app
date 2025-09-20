import { Node, Edge } from 'reactflow';

// Backendから受け取るデータ型
export interface RoadmapNode {
    id: string;
    title: string;
    description: string;
    prerequisites: string[];
    estimatedHours: number;
    position: { x: number; y: number };
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

export interface NodeProgress {
    nodeId: string;
    status: 'not_started' | 'next' | 'completed' | 'needs_review';
    masteryScore: number;
    lastAssessed?: string;
    studyTimeMinutes: number;
}

export interface DashboardData {
    heatmapData: any[]; // 必要に応じて詳細な型定義
    progressStats: {
        completionPercentage: number;
        totalStudyHours: number;
        averageDailyMinutes: number;
        streak: number;
        lastActiveDate: string;
    };
    nodeStats: {
        mastered: number;
        inProgress: number;
        notStarted: number;
        needsReview: number;
    };
    weeklyTrend: any[]; // 必要に応じて詳細な型定義
    nodeProgress: NodeProgress[];
}