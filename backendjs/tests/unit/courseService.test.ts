import { CourseService } from '../../src/services/courseService';
import { prisma } from '../setup';

describe('CourseService', () => {
  let courseService: CourseService;

  beforeEach(() => {
    courseService = new CourseService();
  });

  describe('getPresetCourses', () => {
    it('should return only preset courses', async () => {
      // Create preset and custom courses
      await prisma.course.createMany({
        data: [
          {
            id: 'preset-1',
            title: 'Preset Course 1',
            description: 'A preset course',
            category: 'Programming',
            isPreset: true,
          },
          {
            id: 'custom-1',
            title: 'Custom Course 1',
            description: 'A custom course',
            category: 'Programming',
            isPreset: false,
          },
        ],
      });

      const courses = await courseService.getPresetCourses();

      expect(courses).toHaveLength(1);
      expect(courses[0]).toMatchObject({
        id: 'preset-1',
        title: 'Preset Course 1',
        isPreset: true,
      });
    });

    it('should return courses sorted by title', async () => {
      await prisma.course.createMany({
        data: [
          {
            id: 'course-z',
            title: 'Z Course',
            description: 'Last course',
            category: 'Programming',
            isPreset: true,
          },
          {
            id: 'course-a',
            title: 'A Course',
            description: 'First course',
            category: 'Programming',
            isPreset: true,
          },
        ],
      });

      const courses = await courseService.getPresetCourses();

      expect(courses).toHaveLength(2);
      expect(courses[0].title).toBe('A Course');
      expect(courses[1].title).toBe('Z Course');
    });
  });

  describe('getCourse', () => {
    it('should return course by ID', async () => {
      const courseData = {
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        category: 'Programming',
        isPreset: true,
      };

      await prisma.course.create({ data: courseData });

      const course = await courseService.getCourse('test-course');

      expect(course).toMatchObject({
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        category: 'Programming',
        isPreset: true,
        createdAt: expect.any(String),
      });
    });

    it('should throw NotFoundError for non-existent course', async () => {
      await expect(courseService.getCourse('non-existent')).rejects.toThrow('Course not found');
    });
  });

  describe('createUserCourse', () => {
    let testSession: any;
    let testCourse: any;

    beforeEach(async () => {
      testSession = await prisma.session.create({
        data: { name: 'Test User' },
      });

      testCourse = await prisma.course.create({
        data: {
          id: 'test-course',
          title: 'Test Course',
          description: 'A test course',
          category: 'Programming',
          isPreset: true,
        },
      });
    });

    it('should create user course enrollment', async () => {
      const result = await courseService.createUserCourse(testSession.id, testCourse.id);

      expect(result).toMatchObject({
        userCourseId: expect.any(String),
        course: {
          id: testCourse.id,
          title: 'Test Course',
        },
        status: 'active',
      });

      // Verify database record
      const userCourse = await prisma.userCourse.findUnique({
        where: { id: result.userCourseId },
      });
      expect(userCourse).toBeTruthy();
    });

    it('should throw error for duplicate enrollment', async () => {
      // Create first enrollment
      await courseService.createUserCourse(testSession.id, testCourse.id);

      // Attempt duplicate enrollment
      await expect(
        courseService.createUserCourse(testSession.id, testCourse.id)
      ).rejects.toThrow('User is already enrolled in this course');
    });

    it('should throw error for non-existent session', async () => {
      const fakeSessionId = '550e8400-e29b-41d4-a716-446655440000';
      await expect(
        courseService.createUserCourse(fakeSessionId, testCourse.id)
      ).rejects.toThrow('Session not found');
    });

    it('should throw error for non-existent course', async () => {
      await expect(
        courseService.createUserCourse(testSession.id, 'non-existent')
      ).rejects.toThrow('Course not found');
    });
  });
});