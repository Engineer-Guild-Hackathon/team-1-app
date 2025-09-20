import axios, { AxiosInstance } from 'axios';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { ExternalServiceError } from '@/middleware/errorHandler';
import {
  AIRoadmapRequest,
  AIAssessmentRequest,
  AIStudyPlanRequest,
  RoadmapData,
  AssessmentQuestion,
  StudyDay,
  StudyPlanSummary,
} from '@/types';

class AIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.aiServiceUrl,
      timeout: config.aiService.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      logger.info('AI Service request', {
        url: config.url,
        method: config.method,
      });
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.info('AI Service response', {
          url: response.config.url,
          status: response.status,
        });
        return response;
      },
      (error) => {
        logger.error('AI Service error', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
        throw new ExternalServiceError(
          'AI service request failed',
          error.response?.data || error.message
        );
      }
    );
  }

  async generateRoadmap(request: AIRoadmapRequest): Promise<RoadmapData> {
    try {
      const response = await this.client.post('/ai/generate-roadmap', request);
      return response.data;
    } catch (error) {
      logger.error('Failed to generate roadmap', { error });
      throw error;
    }
  }

  async generateAssessment(request: AIAssessmentRequest): Promise<{
    questions: AssessmentQuestion[];
    estimatedMinutes: number;
  }> {
    try {
      const response = await this.client.post('/ai/generate-assessment', request);
      return response.data;
    } catch (error) {
      logger.error('Failed to generate assessment', { error });
      throw error;
    }
  }

  async evaluateAssessment(assessmentId: string, answers: Array<{
    questionId: string;
    answer: string | string[];
  }>): Promise<{
    score: number;
    nodeScores: Array<{
      nodeId: string;
      score: number;
      feedback: string;
      recommendedAction: 'continue' | 'review' | 'master';
    }>;
    overallFeedback: string;
  }> {
    try {
      const response = await this.client.post('/ai/evaluate-assessment', {
        assessmentId,
        answers,
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to evaluate assessment', { error });
      throw error;
    }
  }

  async generateStudyPlan(request: AIStudyPlanRequest): Promise<{
    schedule: StudyDay[];
    summary: StudyPlanSummary;
  }> {
    try {
      const response = await this.client.post('/ai/generate-study-plan', request);
      return response.data;
    } catch (error) {
      logger.error('Failed to generate study plan', { error });
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error('AI Service health check failed', { error });
      return false;
    }
  }
}

export const aiService = new AIService();