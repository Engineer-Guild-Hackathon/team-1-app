# LightUp AI Learning Platform Backend

An AI-driven intelligent learning platform backend built with Node.js, TypeScript, and Express.js. The platform supports personalized learning path generation, intelligent assessment, and study plan creation.

## 🚀 Features

- **User Session Management**: Demo mode with session-based user management
- **Course Management**: Preset courses and AI-generated custom courses
- **Intelligent RoadmapDisplay Generation**: AI-powered learning path creation
- **Smart Assessment System**: Adaptive testing with AI evaluation
- **Personalized Study Plans**: AI-generated study schedules
- **Learning Analytics**: Progress tracking and dashboard insights
- **RESTful API**: Comprehensive API with OpenAPI documentation

## 🛠 Tech Stack

- **Backend**: Node.js + TypeScript + Express.js
- **Database**: SQLite + Prisma ORM
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Docker + Docker Compose

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker (optional, for containerized deployment)

## 🏃‍♂️ Quick Start

### Option 1: Automated Setup

```bash
# Clone the repository
git clone <repository-url>
cd lightup-backend-node

# Run the setup script
./scripts/dev-setup.sh

# Start the development server
npm run dev
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Setup database
npm run db:push

# Seed database with initial data
npm run db:seed

# Start development server
npm run dev
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run type-check  # Type checking
```

## 🌐 API Endpoints

### Sessions
- `POST /api/sessions` - Create a new session
- `GET /api/sessions/:sessionId` - Get session details

### Courses
- `GET /api/courses` - Get preset courses
- `POST /api/courses/generate` - Generate custom course with AI
- `GET /api/courses/:courseId` - Get course details

### User Courses
- `POST /api/user-courses` - Enroll in a course
- `GET /api/user-courses/:userCourseId` - Get user course details
- `PUT /api/user-courses/:userCourseId/status` - Update course status

### Progress
- `GET /api/user-courses/:userCourseId/progress` - Get learning progress
- `PUT /api/user-courses/:userCourseId/node-progress` - Update node progress

### Roadmaps
- `GET /api/roadmaps/:courseId` - Get course roadmap

### Assessments
- `POST /api/assessments/generate` - Generate AI assessment
- `POST /api/assessments/:assessmentId/submit` - Submit assessment
- `GET /api/assessments/:assessmentId` - Get assessment details

### Study Plans
- `POST /api/study-plans/generate` - Generate AI study plan
- `GET /api/study-plans/:studyPlanId` - Get study plan
- `PUT /api/study-plans/:studyPlanId/progress` - Update study progress

### Analytics
- `POST /api/study-logs` - Create study log
- `GET /api/user-courses/:userCourseId/study-logs` - Get study logs
- `GET /api/dashboard/:userCourseId` - Get dashboard data

## 📖 API Documentation

When running in development mode, API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🗄️ Database Schema

The application uses SQLite with Prisma ORM. Key models include:

- **Session**: User sessions (demo mode)
- **Course**: Learning courses (preset and custom)
- **UserCourse**: User enrollment in courses
- **RoadmapDisplay**: Learning path structure
- **KnowledgeNode**: Individual learning units
- **UserNodeProgress**: User progress on nodes
- **AssessmentSession**: AI-generated assessments
- **StudyPlan**: Personalized study schedules
- **StudyLog**: Learning activity logs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test files
npm test sessions.test.ts

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test coverage includes:
- Unit tests for services and utilities
- Integration tests for API endpoints
- Validation and middleware testing

## 🐳 Docker Deployment

### Development
```bash
docker-compose --profile dev up
```

### Production
```bash
docker-compose up
```

### With AI Service
```bash
docker-compose --profile with-ai up
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
AI_SERVICE_URL="http://localhost:8001"
PORT=8000
NODE_ENV=development
LOG_LEVEL=info
CORS_ORIGINS="http://localhost:3000"
```

### AI Service Integration

The backend integrates with a separate Python AI service for:
- RoadmapDisplay generation
- Assessment creation
- Study plan optimization

Configure the AI service URL in the environment variables.

## 📊 Monitoring and Logging

- Structured logging with Winston
- Request/response logging with correlation IDs
- Health check endpoints
- Error tracking and reporting

## 🛡️ Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- SQL injection prevention with Prisma

## 🔄 Development Workflow

1. **Setup**: Run `./scripts/dev-setup.sh`
2. **Development**: Use `npm run dev` for hot reload
3. **Testing**: Run tests with `npm test`
4. **Database**: Use `npm run db:studio` to inspect data
5. **Linting**: Run `npm run lint` before commits

## 📈 Performance

- Compression middleware
- Database query optimization
- Connection pooling
- Efficient JSON responses
- Background task processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run linting and tests
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

- Check the [API documentation](http://localhost:8000/docs)
- Review the test files for usage examples
- Check the logs for debugging information

## 🗃️ Preset Courses

The application comes with the following preset courses:

1. **Python Programming** - Complete Python learning path
2. **Frontend Programming** - Modern web development
3. **Software Engineer** - Software engineering fundamentals
4. **TOEIC English** - Business English preparation
5. **Physics at High School Level** - Comprehensive physics
6. **Mathematics at High School Level** - Complete mathematics program

## 🔮 Future Enhancements

- Real-time progress notifications
- Advanced analytics and insights
- Mobile app API support
- Multi-language support
- Social learning features
- Gamification elements
