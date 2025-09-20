import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { config, validateConfig } from './config';
import { createRequestLogger, logger } from './utils/logger';
import { checkDatabaseConnection, closeDatabaseConnection } from './utils/prisma';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { router } from './routes';

// Validate configuration
validateConfig();

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimits.windowMs,
  max: config.rateLimits.max,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(createRequestLogger());

// Swagger documentation
if (config.nodeEnv === 'development') {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'LightUp AI Learning Platform API',
        version: '1.0.0',
        description: 'AI-driven intelligent learning platform backend API',
        contact: {
          name: 'API Support',
          email: 'support@lightup.ai',
        },
      },
      servers: [
        {
          url: `http://localhost:${config.port}`,
          description: 'Development server',
        },
      ],
      components: {
        schemas: {
          Error: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    example: 'VALIDATION_ERROR',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid request data',
                  },
                  details: {
                    type: 'object',
                    additionalProperties: true,
                  },
                },
                required: ['code', 'message'],
              },
            },
          },
          SuccessResponse: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
  };

  const specs = swaggerJsdoc(swaggerOptions);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  }));

  logger.info('Swagger documentation available at /docs');
}

// API routes
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      version: process.env.npm_package_version || '1.0.0',
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, starting graceful shutdown`);

  try {
    await closeDatabaseConnection();
    logger.info('Database connections closed');

    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', { error });
    process.exit(1);
  }
}

async function startServer(): Promise<void> {
  try {
    // Check database connection
    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    logger.info('Database connection established');

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 LightUp AI Backend server running on port ${config.port}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);

      if (config.nodeEnv === 'development') {
        logger.info(`📖 API Documentation: http://localhost:${config.port}/docs`);
        logger.info(`🔍 Health Check: http://localhost:${config.port}/health`);
      }
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${config.port} is already in use`);
      } else {
        logger.error('Server error', { error: error.message });
      }
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export { app };