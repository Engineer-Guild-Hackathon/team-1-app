import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
});

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean test database before each test
  await prisma.studyLog.deleteMany();
  await prisma.userNodeProgress.deleteMany();
  await prisma.assessmentSession.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.userCourse.deleteMany();
  await prisma.knowledgeNode.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.course.deleteMany();
  await prisma.session.deleteMany();
});

afterAll(async () => {
  // Disconnect from test database
  await prisma.$disconnect();
});

export { prisma };