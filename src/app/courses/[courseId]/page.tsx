import Link from 'next/link';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import LearningProgress from '@/components/LearningProgress';
import { getRoadmapData, getDashboardData } from '@/app/actions/roadmapActions';
import { Node, Edge } from 'reactflow';
import { RoadmapData, DashboardData } from '@/types/types';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
    // ★★★ 変更点：ここでcourseIdを分割代入で取り出します ★★★
    const { courseId } = params;

    // 新しく作成したActionを呼び出す
    const roadmapData = await getRoadmapData(courseId);

    // デモ用の固定userCourseId。python-programmingの場合のみ進捗データを取得
    let dashboardData: DashboardData | null = null;
    if (courseId === 'python-programming') {
        const userCourseId = 'clxjy2qde000008l3fjd9g9z9'; // シードで設定した固定ID
        dashboardData = await getDashboardData(userCourseId);
    }

    if (!roadmapData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Failed to load Roadmap</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {/* ★★★ 変更点：変数 courseId を使用します ★★★ */}
                    Could not retrieve data for course ID: <span className="font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">{courseId}</span>
                </p>
                <p className="text-gray-500 dark:text-gray-300">Please ensure the backend server is running and the database is seeded correctly.</p>
                <Link href="/" className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    // APIデータをReact Flowが要求する形式に変換
    const initialNodes: Node[] = roadmapData.nodes.map((node) => ({
        id: node.id,
        position: node.position,
        data: { label: node.title, description: node.description },
        type: 'default',
    }));

    const initialEdges: Edge[] = roadmapData.edges.map((edge, i) => ({
        id: `e${i}-${edge.from}-${edge.to}`,
        source: edge.from,
        target: edge.to,
        animated: true,
        type: 'smoothstep',
    }));

    // コース名を取得
    const courseTitle = roadmapData.title.replace(' Learning Path', '');

    return (
        <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center shrink-0">
                <Link href="/" className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    &larr;
                </Link>
                <h1 className="text-2xl font-bold">{courseTitle}</h1>
            </header>
            <main className="flex flex-grow overflow-hidden">
                <div className="flex-grow h-full">
                    <RoadmapDisplay
                        initialNodes={initialNodes}
                        initialEdges={initialEdges}
                        nodeProgress={dashboardData?.nodeProgress || []}
                    />
                </div>
                <aside className="w-[400px] h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 overflow-y-auto">
                    {dashboardData ? (
                        <LearningProgress data={dashboardData} />
                    ) : (
                        <div className="text-center text-gray-500 mt-10">
                            <p>No progress data available for this course.</p>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
}