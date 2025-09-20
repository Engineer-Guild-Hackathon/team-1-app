# LightUp AI Service

An AI-powered microservice for the LightUp learning platform, providing intelligent assessment generation, study plan creation, and learning roadmap optimization.

## 🚀 Features

### 🧠 **AI Assessment Generation**
- **Intelligent Question Creation**: Generate contextual questions based on knowledge nodes
- **Multi-format Support**: Multiple choice, short answer, true/false, and coding questions
- **Adaptive Difficulty**: Dynamic difficulty adjustment based on user progress
- **Automated Evaluation**: AI-powered answer scoring with detailed feedback

### 📅 **Smart Study Planning**
- **Personalized Schedules**: Generate optimal daily study plans
- **Time Optimization**: Balance workload across available time slots
- **Progress Adaptation**: Adjust plans based on user feedback and performance
- **Learning Style Awareness**: Customize activities for different learning preferences

### 🗺️ **Learning RoadmapDisplay Generation**
- **Intelligent Sequencing**: Create logical learning progressions
- **Prerequisite Management**: Automatic dependency resolution
- **Visual Layouts**: Generate optimal node positioning for visualization
- **Quality Validation**: Detect cycles, connectivity issues, and optimization opportunities

## 🛠 Tech Stack

- **Framework**: FastAPI + uvicorn
- **AI/ML**: OpenAI GPT-4, LangChain
- **Data Validation**: Pydantic v2
- **HTTP Client**: httpx for external API calls
- **Caching**: Redis (optional)
- **Testing**: pytest + pytest-asyncio
- **Deployment**: Docker + Docker Compose
- **Code Quality**: Black, isort, flake8, mypy

## 📋 Prerequisites

- Python 3.9+
- OpenAI API key
- Redis (optional, for caching)
- Docker (for containerized deployment)

## 🏃‍♂️ Quick Start

### Option 1: Direct Python Setup

```bash
# Clone the repository
git clone <repository-url>
cd lightup-ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run the service
python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
```

### Option 2: Docker Development

```bash
# Clone and navigate
git clone <repository-url>
cd lightup-ai-service

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Run development environment
docker-compose --profile dev up
```

### Option 3: Production Deployment

```bash
# Production deployment
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# AI Service Configuration
AI_SERVICE_PORT=8001
AI_SERVICE_HOST=0.0.0.0
LOG_LEVEL=INFO
ENVIRONMENT=production

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.7

# External Services
NODE_BACKEND_URL=http://localhost:8000
SEARCH_API_URL=https://api.tavily.com/search
SEARCH_API_KEY=your_search_api_key

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
REDIS_ENABLED=true
CACHE_TTL=3600

# Timeouts (seconds)
LLM_TIMEOUT=60
ASSESSMENT_GENERATION_TIMEOUT=120
STUDY_PLAN_GENERATION_TIMEOUT=180
```

## 📖 API Documentation

### Assessment Endpoints

```http
POST /ai/generate-assessment
POST /ai/evaluate-assessment
GET  /ai/assessment/{assessment_id}
```

### Study Plan Endpoints

```http
POST /ai/generate-study-plan
POST /ai/adjust-study-plan
GET  /ai/study-plan/{plan_id}
GET  /ai/study-plan/{plan_id}/summary
GET  /ai/study-plan/{plan_id}/calendar
```

### RoadmapDisplay Endpoints

```http
POST /ai/generate-roadmap
POST /ai/validate-roadmap
GET  /ai/roadmap/{roadmap_id}
GET  /ai/roadmap/{roadmap_id}/metrics
GET  /ai/roadmap/{roadmap_id}/visualization
```

### Health & Monitoring

```http
GET  /health
POST /ai/clear-cache
```

## 💡 Usage Examples

### Generate Assessment

```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post("http://localhost:8001/ai/generate-assessment", json={
        "user_course_id": "course_123",
        "nodes": [
            {
                "id": "python-basics",
                "title": "Python Basics",
                "description": "Learn Python fundamentals",
                "prerequisites": [],
                "estimated_hours": 8.0,
                "current_user_status": "next"
            }
        ],
        "difficulty_level": "medium",
        "question_count": 6
    })

    assessment = response.json()
    print(f"Generated {len(assessment['questions'])} questions")
```

### Generate Study Plan

```python
async with httpx.AsyncClient() as client:
    response = await client.post("http://localhost:8001/ai/generate-study-plan", json={
        "user_course_id": "course_123",
        "roadmap": {
            "nodes": [...],
            "edges": [...],
            "total_estimated_hours": 50.0
        },
        "user_progress": [...],
        "time_constraints": {
            "target_days": 30,
            "daily_hours": 2.0
        }
    })

    plan = response.json()
    print(f"Generated {len(plan['daily_schedule'])} day plan")
```

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_assessment_api.py -v

# Run with coverage
python -m pytest tests/ --cov=src --cov-report=html

# Run tests in Docker
docker-compose --profile test up
```

## 🔄 Development Workflow

### Code Quality

```bash
# Format code
black src/ tests/
isort src/ tests/

# Lint code
flake8 src/ tests/

# Type checking
mypy src/
```

### Docker Development

```bash
# Development with hot reload
docker-compose --profile dev up

# Run tests
docker-compose --profile test up

# Load testing
docker-compose --profile load-test up
```

## 📊 Monitoring & Debugging

### Health Checks

```bash
# Check service health
curl http://localhost:8001/health

# Check LLM provider status
curl -X GET http://localhost:8001/health | jq '.providers'
```

### Cache Management

```bash
# Clear all caches
curl -X POST http://localhost:8001/ai/clear-cache
```

### Logs

```bash
# View logs in Docker
docker-compose logs -f lightup-ai

# View specific service logs
docker-compose logs -f redis
```

## 🚀 Deployment

### Production Checklist

- [ ] Set secure API keys in environment
- [ ] Configure Redis for caching
- [ ] Set up monitoring and alerting
- [ ] Configure reverse proxy (nginx/caddy)
- [ ] Set up log aggregation
- [ ] Configure backup strategies

### Docker Compose Production

```bash
# Production deployment
docker-compose up -d

# Scale services
docker-compose up -d --scale lightup-ai=3

# Update services
docker-compose pull
docker-compose up -d
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lightup-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lightup-ai
  template:
    metadata:
      labels:
        app: lightup-ai
    spec:
      containers:
      - name: lightup-ai
        image: lightup-ai:latest
        ports:
        - containerPort: 8001
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-secrets
              key: openai-api-key
```

## 🔧 Architecture

### Service Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   Node.js       │────▶│   Python AI      │
│   Backend       │     │   Service        │
│   (Port 8000)   │     │   (Port 8001)    │
└─────────────────┘     └──────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │   OpenAI API      │
                        │   (GPT-4)         │
                        └───────────────────┘
```

### Internal Components

```
src/
├── api/              # FastAPI route handlers
├── services/         # Business logic layer
│   ├── ai_assessment.py
│   ├── ai_study_plan.py
│   └── ai_roadmap.py
├── models/           # Pydantic data models
├── utils/            # Utility functions
│   ├── graph_analyzer.py
│   ├── time_calculator.py
│   └── prompt_templates.py
└── config/           # Configuration management
```

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   ```bash
   # Check API key
   echo $OPENAI_API_KEY

   # Test API connectivity
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
        https://api.openai.com/v1/models
   ```

2. **Redis Connection Issues**
   ```bash
   # Check Redis connectivity
   redis-cli ping

   # Disable Redis temporarily
   export REDIS_ENABLED=false
   ```

3. **Memory Issues**
   ```bash
   # Monitor memory usage
   docker stats

   # Increase container memory limits
   docker-compose up -d --memory 2g
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install development dependencies
pip install -r requirements.txt
pip install pytest pytest-asyncio pytest-mock

# Install pre-commit hooks
pre-commit install

# Run tests before committing
python -m pytest tests/ -v
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` endpoint when running in development
- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join the community discussions for questions and ideas

## 🔮 RoadmapDisplay

- [ ] **Advanced AI Models**: Support for Claude, Gemini, and other LLMs
- [ ] **Real-time Adaptation**: Live plan adjustments based on learning velocity
- [ ] **Multi-language Support**: Internationalization for global users
- [ ] **Advanced Analytics**: ML-powered learning insights and predictions
- [ ] **Voice Integration**: Voice-powered assessment and interaction
- [ ] **Mobile Optimization**: Enhanced mobile API support