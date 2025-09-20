import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { SessionController } from '../controllers/sessions';
import { CourseController } from '../controllers/courses';
import { RoadmapController } from '../controllers/roadmaps';
import { AssessmentController } from '../controllers/assessments';
import { StudyPlanController } from '../controllers/studyPlans';
import { DashboardController } from '../controllers/dashboard';

import {
  createSessionSchema,
  getSessionSchema,
} from '../schemas/session';

import {
  generateCourseSchema,
  getCourseSchema,
  createUserCourseSchema,
  getUserCourseSchema,
  updateUserCourseStatusSchema,
  updateNodeProgressSchema,
} from '../schemas/course';

import {
  generateAssessmentSchema,
  submitAssessmentSchema,
  getAssessmentSchema,
} from '../schemas/assessment';

import {
  generateStudyPlanSchema,
  getStudyPlanSchema,
  updateStudyPlanProgressSchema,
} from '../schemas/studyPlan';

import {
  createStudyLogSchema,
  getStudyLogsSchema,
  getDashboardSchema,
} from '../schemas/studyLog';

const router = Router();

// Initialize controllers
const sessionController = new SessionController();
const courseController = new CourseController();
const roadmapController = new RoadmapController();
const assessmentController = new AssessmentController();
const studyPlanController = new StudyPlanController();
const dashboardController = new DashboardController();

// Session routes
router.post('/sessions', validateRequest(createSessionSchema), sessionController.createSession);
router.get('/sessions/:sessionId', validateRequest(getSessionSchema), sessionController.getSession);

// Course routes
router.get('/courses', courseController.getCourses);
router.post('/courses/generate', validateRequest(generateCourseSchema), courseController.generateCourse);
router.get('/courses/:courseId', validateRequest(getCourseSchema), courseController.getCourse);

// User Course routes
router.post('/user-courses', validateRequest(createUserCourseSchema), courseController.createUserCourse);
router.get('/user-courses/:userCourseId', validateRequest(getUserCourseSchema), courseController.getUserCourse);
router.put('/user-courses/:userCourseId/status', validateRequest(updateUserCourseStatusSchema), courseController.updateUserCourseStatus);

// Progress routes
router.get('/user-courses/:userCourseId/progress', validateRequest(getUserCourseSchema), courseController.getUserProgress);
router.put('/user-courses/:userCourseId/node-progress', validateRequest(updateNodeProgressSchema), courseController.updateNodeProgress);

// RoadmapDisplay routes
router.get('/roadmaps/:courseId', roadmapController.getRoadmap);

// Assessment routes
router.post('/assessments/generate', validateRequest(generateAssessmentSchema), assessmentController.generateAssessment);
router.post('/assessments/:assessmentId/submit', validateRequest(submitAssessmentSchema), assessmentController.submitAssessment);
router.get('/assessments/:assessmentId', validateRequest(getAssessmentSchema), assessmentController.getAssessment);

// Study Plan routes
router.post('/study-plans/generate', validateRequest(generateStudyPlanSchema), studyPlanController.generateStudyPlan);
router.get('/study-plans/:studyPlanId', validateRequest(getStudyPlanSchema), studyPlanController.getStudyPlan);
router.put('/study-plans/:studyPlanId/progress', validateRequest(updateStudyPlanProgressSchema), studyPlanController.updateStudyPlanProgress);

// Study Log and Dashboard routes
router.post('/study-logs', validateRequest(createStudyLogSchema), dashboardController.createStudyLog);
router.get('/user-courses/:userCourseId/study-logs', validateRequest(getStudyLogsSchema), dashboardController.getStudyLogs);
router.get('/dashboard/:userCourseId', validateRequest(getDashboardSchema), dashboardController.getDashboard);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    },
  });
});

export { router };