import { fetchCourses, TCourse } from '@/app/actions/cource';
import { JSX } from 'react';
import Link from 'next/link';

// 各コースのアイコンを定義します。SVG形式で自由にカスタマイズできます。
const courseIcons: { [key: string]: JSX.Element } = {
    'python-programming': (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-500/10">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
            >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
        </div>
    ),
    'frontend-programming': (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-purple-500/10">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
            >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
        </div>
    ),
    default: (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-green-500/10">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400"
            >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
        </div>
    ),
};

// コースカードのUIを定義するコンポーネント
const CourseCard = ({ course }: { course: TCourse }) => {
    const isProgrammingCore = course.id === 'python-programming';
    const isFrontendRoadmap = course.id === 'frontend-programming';

    const titleColor = isFrontendRoadmap ? 'text-purple-500' : 'text-gray-900 dark:text-white';
    const buttonClasses = isProgrammingCore
        ? 'bg-gray-900 hover:bg-gray-700 text-white'
        : 'bg-purple-600 hover:bg-purple-700 text-white';

    const icon = courseIcons[course.id] || courseIcons.default;

    return (
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3">{icon}</div>
            <div className="flex flex-col flex-grow">
                <h2 className={`mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white`}>{course.title}</h2>
                <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{course.description}</p>
                <div className={`inline-flex font-medium items-center text-blue-600 hover:underline ${buttonClasses}`}>
                    {isProgrammingCore ? 'Start Learning' : 'Explore Path'} →
                </div>
            </div>
        </div>
    );
};

// ホームページのメインコンポーネント
export default async function Home() {
    const { data: courses } = await fetchCourses();

    return (
        <div className="text-gray-800 dark:text-white min-h-screen font-sans bg-gray-50 dark:bg-black">
            <div className="container mx-auto px-4 py-8">
                {/* ヘッダー */}
                <header className="flex justify-between items-center mb-20">
                    <div></div>
                </header>

                {/* メインコンテンツ */}
                <main className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Debug My Knowledge
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
                        Choose your learning path and master programming skills with interactive roadmaps
                    </p>

                    {/* コースカードのグリッド表示 */}
                    <div className="grid grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <div>
                                <Link
                                    href={`/courses/${course.id}`}
                                    key={course.id}
                                    className="block hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-lg"
                                >
                                <CourseCard course={course} />
                            </Link>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}