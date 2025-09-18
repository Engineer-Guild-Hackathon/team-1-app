import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../setup';

describe('Sessions API', () => {
  describe('POST /api/sessions', () => {
    it('should create a session without name', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({})
        .expect(201);

      expect(response.body.data).toMatchObject({
        sessionId: expect.any(String),
        name: null,
        createdAt: expect.any(String),
      });

      // Verify session was created in database
      const session = await prisma.session.findUnique({
        where: { id: response.body.data.sessionId },
      });
      expect(session).toBeTruthy();
    });

    it('should create a session with name', async () => {
      const sessionName = 'Test User';
      const response = await request(app)
        .post('/api/sessions')
        .send({ name: sessionName })
        .expect(201);

      expect(response.body.data).toMatchObject({
        sessionId: expect.any(String),
        name: sessionName,
        createdAt: expect.any(String),
      });
    });

    it('should validate name length', async () => {
      const longName = 'a'.repeat(101);
      await request(app)
        .post('/api/sessions')
        .send({ name: longName })
        .expect(400);
    });
  });

  describe('GET /api/sessions/:sessionId', () => {
    it('should get existing session', async () => {
      // Create a session first
      const createResponse = await request(app)
        .post('/api/sessions')
        .send({ name: 'Test User' });

      const sessionId = createResponse.body.data.sessionId;

      const response = await request(app)
        .get(`/api/sessions/${sessionId}`)
        .expect(200);

      expect(response.body.data).toMatchObject({
        id: sessionId,
        name: 'Test User',
        createdAt: expect.any(String),
      });
    });

    it('should return 404 for non-existent session', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      await request(app)
        .get(`/api/sessions/${fakeId}`)
        .expect(404);
    });

    it('should validate session ID format', async () => {
      await request(app)
        .get('/api/sessions/invalid-id')
        .expect(400);
    });
  });
});