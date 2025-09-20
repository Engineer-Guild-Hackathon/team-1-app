import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const presetCourses = [
    {
        id: 'python-programming',
        title: 'Python Programming',
        description: 'Learn Python from basics to advanced concepts including data structures, algorithms, web development, and data science fundamentals.',
        category: 'Programming',
        isPreset: true,
    },
    {
        id: 'frontend-programming',
        title: 'Frontend Programming',
        description: 'Master HTML, CSS, JavaScript and modern frameworks like React, Vue, and Angular to build responsive web applications.',
        category: 'Programming',
        isPreset: true,
    },
    {
        id: 'software-engineer',
        title: 'Software Engineer',
        description: 'Complete software engineering fundamentals including system design, databases, testing, and best practices.',
        category: 'Engineering',
        isPreset: true,
    },
    {
        id: 'japanese-jlpt-n1',
        title: 'Japanese JLPT N1',
        description: 'Advanced Japanese language proficiency preparation for JLPT N1 level including kanji, grammar, reading, and listening.',
        category: 'Language',
        isPreset: true,
    },
    {
        id: 'toeic-english',
        title: 'TOEIC English',
        description: 'Business English proficiency test preparation focusing on listening, reading, speaking, and writing skills.',
        category: 'Language',
        isPreset: true,
    },
    {
        id: 'physics-high-school',
        title: 'Physics at High School Level',
        description: 'Comprehensive high school physics curriculum covering mechanics, thermodynamics, electricity, magnetism, and modern physics.',
        category: 'Science',
        isPreset: true,
    },
    {
        id: 'mathematics-high-school',
        title: 'Mathematics at High School Level',
        description: 'Complete high school mathematics program including algebra, geometry, trigonometry, pre-calculus, and basic statistics.',
        category: 'Mathematics',
        isPreset: true,
    },
];

// Sample roadmap data for Python Programming
const pythonRoadmapData = {
    id: 'python-roadmap',
    courseId: 'python-programming',
    title: 'Python Programming Learning Path',
    nodes: [
        {
            id: 'python-basics',
            title: 'Python Basics',
            description: 'Learn Python syntax, variables, data types, and basic operations',
            prerequisites: [],
            estimatedHours: 8,
            position: { x: 100, y: 100 },
        },
        {
            id: 'control-structures',
            title: 'Control Structures',
            description: 'Master if statements, loops, and conditional logic',
            prerequisites: ['python-basics'],
            estimatedHours: 6,
            position: { x: 300, y: 100 },
        },
        {
            id: 'functions',
            title: 'Functions',
            description: 'Learn to write and use functions effectively',
            prerequisites: ['control-structures'],
            estimatedHours: 10,
            position: { x: 500, y: 100 },
        },
        {
            id: 'data-structures',
            title: 'Data Structures',
            description: 'Work with lists, dictionaries, sets, and tuples',
            prerequisites: ['functions'],
            estimatedHours: 12,
            position: { x: 100, y: 300 },
        },
        {
            id: 'oop',
            title: 'Object-Oriented Programming',
            description: 'Learn classes, objects, inheritance, and polymorphism',
            prerequisites: ['data-structures'],
            estimatedHours: 15,
            position: { x: 300, y: 300 },
        },
        {
            id: 'file-handling',
            title: 'File Handling',
            description: 'Read and write files, work with different file formats',
            prerequisites: ['functions'],
            estimatedHours: 6,
            position: { x: 500, y: 300 },
        },
        {
            id: 'error-handling',
            title: 'Error Handling',
            description: 'Learn exception handling and debugging techniques',
            prerequisites: ['oop', 'file-handling'],
            estimatedHours: 8,
            position: { x: 400, y: 500 },
        },
        {
            id: 'libraries',
            title: 'Popular Libraries',
            description: 'Explore NumPy, Pandas, Requests, and other essential libraries',
            prerequisites: ['error-handling'],
            estimatedHours: 20,
            position: { x: 200, y: 700 },
        },
        {
            id: 'web-development',
            title: 'Web Development',
            description: 'Build web applications with Flask or Django',
            prerequisites: ['libraries'],
            estimatedHours: 25,
            position: { x: 100, y: 900 },
        },
        {
            id: 'data-science',
            title: 'Data Science Basics',
            description: 'Introduction to data analysis and visualization',
            prerequisites: ['libraries'],
            estimatedHours: 20,
            position: { x: 400, y: 900 },
        },
    ],
    edges: [
        { from: 'python-basics', to: 'control-structures', type: 'prerequisite' as const },
        { from: 'control-structures', to: 'functions', type: 'prerequisite' as const },
        { from: 'functions', to: 'data-structures', type: 'prerequisite' as const },
        { from: 'functions', to: 'file-handling', type: 'prerequisite' as const },
        { from: 'data-structures', to: 'oop', type: 'prerequisite' as const },
        { from: 'oop', to: 'error-handling', type: 'prerequisite' as const },
        { from: 'file-handling', to: 'error-handling', type: 'prerequisite' as const },
        { from: 'error-handling', to: 'libraries', type: 'prerequisite' as const },
        { from: 'libraries', to: 'web-development', type: 'prerequisite' as const },
        { from: 'libraries', to: 'data-science', type: 'prerequisite' as const },
    ],
};

// Sample roadmap for Frontend Programming
const frontendRoadmapData = {
    id: 'frontend-roadmap',
    courseId: 'frontend-programming',
    title: 'Frontend Programming Learning Path',
    nodes: [
        {
            id: 'html-basics',
            title: 'HTML Fundamentals',
            description: 'Learn HTML structure, elements, and semantic markup',
            prerequisites: [],
            estimatedHours: 10,
            position: { x: 100, y: 100 },
        },
        {
            id: 'css-basics',
            title: 'CSS Fundamentals',
            description: 'Master styling, layouts, and responsive design',
            prerequisites: ['html-basics'],
            estimatedHours: 15,
            position: { x: 300, y: 100 },
        },
        {
            id: 'javascript-basics',
            title: 'JavaScript Fundamentals',
            description: 'Learn JavaScript syntax, DOM manipulation, and events',
            prerequisites: ['css-basics'],
            estimatedHours: 20,
            position: { x: 500, y: 100 },
        },
        {
            id: 'advanced-css',
            title: 'Advanced CSS',
            description: 'Flexbox, Grid, animations, and CSS preprocessors',
            prerequisites: ['css-basics'],
            estimatedHours: 12,
            position: { x: 300, y: 300 },
        },
        {
            id: 'javascript-advanced',
            title: 'Advanced JavaScript',
            description: 'ES6+, async programming, and modern JavaScript features',
            prerequisites: ['javascript-basics'],
            estimatedHours: 18,
            position: { x: 500, y: 300 },
        },
        {
            id: 'react-basics',
            title: 'React Fundamentals',
            description: 'Learn React components, state, and props',
            prerequisites: ['javascript-advanced'],
            estimatedHours: 25,
            position: { x: 700, y: 300 },
        },
        {
            id: 'react-advanced',
            title: 'Advanced React',
            description: 'Hooks, context, state management, and testing',
            prerequisites: ['react-basics'],
            estimatedHours: 20,
            position: { x: 700, y: 500 },
        },
        {
            id: 'build-tools',
            title: 'Build Tools',
            description: 'Webpack, Vite, and modern development workflow',
            prerequisites: ['react-advanced'],
            estimatedHours: 10,
            position: { x: 500, y: 700 },
        },
    ],
    edges: [
        { from: 'html-basics', to: 'css-basics', type: 'prerequisite' as const },
        { from: 'css-basics', to: 'javascript-basics', type: 'prerequisite' as const },
        { from: 'css-basics', to: 'advanced-css', type: 'prerequisite' as const },
        { from: 'javascript-basics', to: 'javascript-advanced', type: 'prerequisite' as const },
        { from: 'javascript-advanced', to: 'react-basics', type: 'prerequisite' as const },
        { from: 'react-basics', to: 'react-advanced', type: 'prerequisite' as const },
        { from: 'react-advanced', to: 'build-tools', type: 'prerequisite' as const },
    ],
};

async function main(): Promise<void> {
    try {
        // logger.info('🌱 Starting database seeding...');

        // Clean existing data in development
        if (process.env.NODE_ENV === 'development') {
            // logger.info('🧹 Cleaning existing data...');

            await prisma.studyLog.deleteMany();
            await prisma.userNodeProgress.deleteMany();
            await prisma.assessmentSession.deleteMany();
            await prisma.studyPlan.deleteMany();
            await prisma.userCourse.deleteMany();
            await prisma.knowledgeNode.deleteMany();
            await prisma.roadmap.deleteMany();
            await prisma.course.deleteMany();
            await prisma.session.deleteMany();

            // logger.info('✅ Existing data cleaned');
        }

        // Insert preset courses
        // logger.info('📚 Inserting preset courses...');
        for (const course of presetCourses) {
            await prisma.course.create({
                data: course,
            });
        }
        // logger.info(`✅ ${presetCourses.length} preset courses inserted`);

        // Insert sample roadmaps and nodes
        // logger.info('🗺️ Creating sample roadmaps...');

        // Python roadmap
        const pythonRoadmap = await prisma.roadmap.create({
            data: {
                id: pythonRoadmapData.id,
                courseId: pythonRoadmapData.courseId,
                title: pythonRoadmapData.title,
                graphData: JSON.parse(JSON.stringify(pythonRoadmapData)),
            },
        });

        for (const node of pythonRoadmapData.nodes) {
            await prisma.knowledgeNode.create({
                data: {
                    id: node.id,
                    roadmapId: pythonRoadmapData.id,
                    title: node.title,
                    description: node.description,
                    prerequisites: JSON.parse(JSON.stringify(node.prerequisites)),
                    estimatedHours: node.estimatedHours,
                    position: JSON.parse(JSON.stringify(node.position)),
                },
            });
        }

        // Frontend roadmap
        const frontendRoadmap = await prisma.roadmap.create({
            data: {
                id: frontendRoadmapData.id,
                courseId: frontendRoadmapData.courseId,
                title: frontendRoadmapData.title,
                graphData: JSON.parse(JSON.stringify(frontendRoadmapData)),
            },
        });

        for (const node of frontendRoadmapData.nodes) {
            await prisma.knowledgeNode.create({
                data: {
                    id: node.id,
                    roadmapId: frontendRoadmapData.id,
                    title: node.title,
                    description: node.description,
                    prerequisites: JSON.parse(JSON.stringify(node.prerequisites)),
                    estimatedHours: node.estimatedHours,
                    position: JSON.parse(JSON.stringify(node.position)),
                },
            });
        }

        // logger.info('✅ Sample roadmaps and nodes created');

        // Create a demo session and user course for testing
        if (process.env.NODE_ENV === 'development') {
            // logger.info('🧪 Creating demo data for testing...');

            const demoSession = await prisma.session.create({
                data: {
                    name: 'Demo User',
                },
            }) as { id: string; name: string };

            const demoUserCourse = await prisma.userCourse.create({
                data: {
                    sessionId: demoSession.id,
                    courseId: 'python-programming',
                    status: 'active',
                },
            }) as { id: string; sessionId: string; courseId: string; status: string };

            // Initialize node progress for demo user
            const nodeProgressData = pythonRoadmapData.nodes.map((node, index) => ({
                userCourseId: demoUserCourse.id,
                nodeId: node.id,
                status: index === 0 ? 'next' : 'not_started',
                masteryScore: 0,
                studyTimeMinutes: 0,
            }));

            await prisma.userNodeProgress.createMany({
                data: nodeProgressData,
            });

            // Add some sample study logs
            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const logDate = new Date(today);
                logDate.setDate(logDate.getDate() - i);

                await prisma.studyLog.create({
                    data: {
                        userCourseId: demoUserCourse.id,
                        date: logDate,
                        minutesStudied: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
                        activityType: ['study', 'assessment', 'review'][Math.floor(Math.random() * 3)],
                        nodeIds: JSON.parse(JSON.stringify(['python-basics'])),
                        notes: `Day ${i + 1} of learning Python basics`,
                    },
                });
            }

            // logger.info('✅ Demo data created');
            // logger.info(`📋 Demo Session ID: ${demoSession.id}`);
            // logger.info(`📘 Demo User Course ID: ${demoUserCourse.id}`);
        }

        // logger.info('🎉 Database seeding completed successfully!');

        // Display summary
        const counts = await Promise.all([
            prisma.course.count(),
            prisma.roadmap.count(),
            prisma.knowledgeNode.count(),
            prisma.session.count(),
            prisma.userCourse.count(),
        ]);
/*
        logger.info('📊 Database Summary:');
        logger.info(`   • Courses: ${counts[0]}`);
        logger.info(`   • Roadmaps: ${counts[1]}`);
        logger.info(`   • Knowledge Nodes: ${counts[2]}`);
        logger.info(`   • Sessions: ${counts[3]}`);
        logger.info(`   • User Courses: ${counts[4]}`);

 */

    } catch (error) {
        // logger.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });