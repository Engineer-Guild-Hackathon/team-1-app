import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../setup';

describe('Courses API', () => {
  let testSession: any;

  beforeEach(async () => {
    // Create test session
    testSession = await prisma.session.create({
      data: { name: 'Test User' },
    });

    // Create test course
    await prisma.course.create({
      data: {
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        category: 'Programming',
        isPreset: true,
      },
    });
  });

  describe('GET /api/courses', () => {
    it('should get preset courses', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(response.body.data.courses).toHaveLength(1);
      expect(response.body.data.courses[0]).toMatchObject({
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        category: 'Programming',
        isPreset: true,
        createdAt: expect.any(String),
      });
    });
  });

  describe('GET /api/courses/:courseId', () => {
    it('should get specific course', async () => {
      const response = await request(app)
        .get('/api/courses/test-course')
        .expect(200);

      expect(response.body.data).toMatchObject({
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        category: 'Programming',
        isPreset: true,
        createdAt: expect.any(String),
      });
    });

    it('should return 404 for non-existent course', async () => {
      await request(app)
        .get('/api/courses/non-existent')
        .expect(404);
    });
  });

  describe('POST /api/user-courses', () => {
    it('should create user course enrollment', async () => {
      const response = await request(app)
        .post('/api/user-courses')
        .send({
          sessionId: testSession.id,
          courseId: 'test-course',
        })
        .expect(201);

      expect(response.body.data).toMatchObject({
        userCourseId: expect.any(String),
        course: {
          id: 'test-course',
          title: 'Test Course',
        },
        status: 'active',
      });

      // Verify user course was created in database
      const userCourse = await prisma.userCourse.findUnique({
        where: { id: response.body.data.userCourseId },
      });
      expect(userCourse).toBeTruthy();
    });

    it('should prevent duplicate enrollments', async () => {
      // Create first enrollment
      await request(app)
        .post('/api/user-courses')
        .send({
          sessionId: testSession.id,
          courseId: 'test-course',
        })
        .expect(201);

      // Attempt duplicate enrollment
      await request(app)
        .post('/api/user-courses')
        .send({
          sessionId: testSession.id,
          courseId: 'test-course',
        })
        .expect(409);
    });

    it('should validate session exists', async () => {
      const fakeSessionId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app)
        .post('/api/user-courses')
        .send({
          sessionId: fakeSessionId,
          courseId: 'test-course',
        })
        .expect(404);
    });
  });

  describe('GET /api/user-courses/:userCourseId', () => {
    let userCourse: any;

    beforeEach(async () => {
      userCourse = await prisma.userCourse.create({
        data: {
          sessionId: testSession.id,
          courseId: 'test-course',
          status: 'active',
        },
      });
    });

    it('should get user course with progress summary', async () => {
      const response = await request(app)
        .get(`/api/user-courses/${userCourse.id}`)
        .expect(200);

      expect(response.body.data).toMatchObject({
        id: userCourse.id,
        sessionId: testSession.id,
        course: {
          id: 'test-course',
          title: 'Test Course',
        },
        status: 'active',
        progressSummary: {
          totalNodes: 0,
          completedNodes: 0,
          nextNodes: 0,
          needsReviewNodes: 0,
        },
      });
    });
  });

  describe('PUT /api/user-courses/:userCourseId/status', () => {
    let userCourse: any;

    beforeEach(async () => {
      userCourse = await prisma.userCourse.create({
        data: {
          sessionId: testSession.id,
          courseId: 'test-course',
          status: 'active',
        },
      });
    });

    it('should update user course status', async () => {
      const response = await request(app)
        .put(`/api/user-courses/${userCourse.id}/status`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.data.status).toBe('completed');

      // Verify status was updated in database
      const updatedUserCourse = await prisma.userCourse.findUnique({
        where: { id: userCourse.id },
      });
      expect(updatedUserCourse?.status).toBe('completed');
    });

    it('should validate status values', async () => {
      await request(app)
        .put(`/api/user-courses/${userCourse.id}/status`)
        .send({ status: 'invalid-status' })
        .expect(400);
    });
  });
});