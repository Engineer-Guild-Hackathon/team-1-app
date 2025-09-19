import { fetchCourses, TCourse } from '@/app/actions/cource';
import {JSX} from "react";

// 各コースのアイコンを定義します。SVG形式で自由にカスタマイズできます。
const courseIcons: { default: JSX.Element; course2: JSX.Element; course1: JSX.Element } = {
    course1: (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
        </div>
    ),
    course2: (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-purple-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
        </div>
    ),
    default: (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-green-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
        </div>
    ),
};

// コースカードのUIを定義するコンポーネント
const CourseCard = ({ course }: { course: TCourse }) => {
    const isProgrammingCore = course.id === 'course1';
    const isFrontendRoadmap = course.id === 'course2';

    const titleColor = isFrontendRoadmap ? 'text-purple-500' : 'text-gray-900 dark:text-white';
    const buttonClasses = isProgrammingCore
        ? 'bg-gray-900 hover:bg-gray-700 text-white'
        : 'bg-purple-600 hover:bg-purple-700 text-white';

    const icon = courseIcons[course.id] || courseIcons.default;

    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10">
            <div className="mb-6">{icon}</div>
            <div>
                <h2 className={`text-xl font-bold mb-2 ${titleColor}`}>{course.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow text-sm">{course.description}</p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-8 text-sm">
                    {Array.isArray(course.content) &&
                        course.content.map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-gray-400 mr-2">・</span>
                                <span>{item}</span>
                            </li>
                        ))}
                </ul>
                <button className={`mt-auto w-full py-3 rounded-lg font-semibold transition-all duration-300 ${buttonClasses}`}>
                    {isProgrammingCore ? 'Start Learning' : 'Explore Path'} →
                </button>
            </div>
        </div>
    );
};

// ホームページのメインコンポーネント
export default async function Home() {
    const { data: courses } = await fetchCourses();

    return (
        <div className="text-gray-800 dark:text-white min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8">
                {/* ヘッダー */}
                <header className="flex justify-between items-center mb-20">
                    <div>
                        {/* 左側にロゴなどを配置できます */}
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-gray-600 dark:text-gray-300">Welcome back,</span>
                        <a href="#" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Demo User</a>
                        <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-lg text-blue-500">
                            D
                        </div>
                        <button className="bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Logout
                        </button>
                    </div>
                </header>

                {/* メインコンテンツ */}
                <main className="text-center">
                    <h1 className="text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        Debug My Knowledge
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
                        Choose your learning path and master programming skills with interactive roadmaps
                    </p>

                    {/* コースカードのグリッド表示 */}
                    <div className="grid grid-cols-3 gap-4">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
