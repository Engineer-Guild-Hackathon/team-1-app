import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8001',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  logLevel: process.env.LOG_LEVEL || 'info',

  // Rate limiting
  rateLimits: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // AI Service timeouts
  aiService: {
    timeout: 30000, // 30 seconds
    retries: 3,
  },
} as const;

export function validateConfig(): void {
  const required = ['DATABASE_URL', 'AI_SERVICE_URL'];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}