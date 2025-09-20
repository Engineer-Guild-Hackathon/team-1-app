'use server';

import { RoadmapData, DashboardData, NodeProgress } from '@/types/types';

const API_BASE_URL = 'http://localhost:8000/api';

// エラーハンドリングを共通化
async function fetchData<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`API Error: ${res.status} ${res.statusText} for URL: ${url}`);
            return null;
        }
        const data = await res.json();
        return data.data as T;
    } catch (error) {
        console.error(`Fetch Error for URL: ${url}`, error);
        return null;
    }
}

// ロードマップデータを取得するAction
export async function getRoadmapData(courseId: string): Promise<RoadmapData | null> {
    return fetchData<RoadmapData>(`${API_BASE_URL}/roadmaps/${courseId}`);
}

// ダッシュボードデータを取得するAction
export async function getDashboardData(userCourseId: string): Promise<DashboardData | null> {
    // DashboardDataにはnodeProgressが含まれないため、別途取得してマージする
    const dashboardStats = await fetchData<Omit<DashboardData, 'nodeProgress'>>(`${API_BASE_URL}/dashboard/${userCourseId}`);
    if (!dashboardStats) return null;

    const progressData = await getUserProgressData(userCourseId);

    return {
        ...dashboardStats,
        nodeProgress: progressData || []
    };
}

// ノードの進捗データを取得するAction
export async function getUserProgressData(userCourseId: string): Promise<NodeProgress[] | null> {
    const data = await fetchData<{ nodeProgress: NodeProgress[] }>(`${API_BASE_URL}/user-courses/${userCourseId}/progress`);
    return data ? data.nodeProgress : null;
}