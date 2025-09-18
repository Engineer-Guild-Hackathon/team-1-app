#!/bin/bash

# LightUp AI Backend Development Setup Script
set -e

echo "🚀 Setting up LightUp AI Backend development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs data

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️ Setting up database schema..."
npm run db:push

# Seed database with initial data
echo "🌱 Seeding database with initial data..."
npm run db:seed

echo ""
echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   • Start development server: npm run dev"
echo "   • View database: npm run db:studio"
echo "   • Run tests: npm test"
echo ""
echo "📖 Available URLs (when server is running):"
echo "   • API Server: http://localhost:8000"
echo "   • Health Check: http://localhost:8000/health"
echo "   • API Documentation: http://localhost:8000/docs"
echo "   • Database Studio: http://localhost:5555 (separate command)"
echo ""
echo "🔍 Useful commands:"
echo "   • npm run dev          - Start development server"
echo "   • npm run build        - Build for production"
echo "   • npm run db:studio    - Open database studio"
echo "   • npm run db:reset     - Reset database"
echo "   • npm run lint         - Run linting"
echo "   • npm run test         - Run tests"
echo ""

# Check if AI service is running
echo "🔗 Checking AI service connection..."
if curl -s http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ AI service is running at http://localhost:8001"
else
    echo "⚠️  AI service not detected at http://localhost:8001"
    echo "   The backend will work but AI features may be limited."
    echo "   Please start the AI service separately if needed."
fi

echo ""
echo "🎉 Setup complete! You can now start developing."