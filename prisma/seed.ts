import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();


async function main() {
    await prisma.course.upsert({
        where: { id: 'course1'},
        update: {updatedAt: new Date()},
        create: {
            id: 'course1',
            title: 'Programming Core',
            description: 'Master programming fundamentals',
            content: ['Variables & Functions', 'Data Structures', 'OOP & Async Programming', 'Interactive Knowledge Tree']}
    })
    await prisma.course.upsert({
        where: {id: 'course2'},
        update: {updatedAt: new Date()},
        create: {
            id: 'course2',
            title: 'Frontend Roadmap',
            description: 'Complete web development path',
            content: ['HTML, CSS, JavaScript', 'React, Vue, Angular', 'Build Tools & Deployment', 'Visual Learning Path']
        }
    })

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