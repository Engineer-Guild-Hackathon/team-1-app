import React from 'react';
import { DashboardData } from '@/types/types';

interface LearningProgressProps {
    data: DashboardData;
}

const LearningProgress: React.FC<LearningProgressProps> = ({ data }) => {
    const { progressStats, nodeStats } = data;
    const completionPercentage = Math.round((nodeStats.mastered / (nodeStats.mastered + nodeStats.inProgress + nodeStats.notStarted + nodeStats.needsReview)) * 100)

    return (
        <div className="space-y-6">
        <h2 className="text-xl font-bold">Learning Progress</h2>

    <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
    <div className="flex justify-between items-center mb-2">
    <span className="font-semibold">Total: {nodeStats.mastered + nodeStats.inProgress + nodeStats.notStarted + nodeStats.needsReview}</span>
    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
    <div
        className="bg-blue-600 h-2.5 rounded-full"
    style={{ width: `${completionPercentage}%` }}
></div>
    </div>
    </div>

    <div className="grid grid-cols-2 gap-4 text-center">
    <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
    <div className="text-2xl font-bold">{nodeStats.mastered} / {nodeStats.mastered + nodeStats.inProgress + nodeStats.notStarted + nodeStats.needsReview}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400">Mastered</div>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
    <div className="text-2xl font-bold">{progressStats.streak}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Streak Days</div>
    </div>
    </div>

    <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
    <div className="text-lg font-semibold mb-2">Study Time</div>
    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{progressStats.totalStudyHours}h</div>
    </div>

    <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        View Detailed Report &rarr;
    </button>

    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
    <h3 className="font-bold mb-4">AI Generated Study Plan</h3>
    <div className="flex items-center gap-2">
    <input type="text" placeholder="Enter topic (e.g., Python, Ja...)" className="flex-grow p-2 border rounded-md bg-transparent"/>
    <button className="p-2 border rounded-md">7</button>
        <button className="p-2 border rounded-md">2</button>
        <button className="p-2 bg-purple-600 text-white rounded-md">⚡</button>
    </div>
    </div>

    <div className="mt-8 flex flex-wrap gap-2">
    <button className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-md">Learning Tasks</button>
    <button className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-md">Review Cards</button>
    <button className="w-full py-3 bg-blue-500 text-white rounded-md mt-2">Take Programming Assessment</button>
    <button className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md mt-2">Progress Heatmap</button>
    <button className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md mt-2">Assessment Tool</button>
    </div>

    </div>
);
};

export default LearningProgress;