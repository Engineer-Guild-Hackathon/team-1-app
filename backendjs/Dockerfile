# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install necessary packages for native dependencies
RUN apk add --no-cache libc6-compat openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Development stage
FROM base AS development

# Install dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Create logs directory
RUN mkdir -p logs

# Start development server
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder

# Install all dependencies for building
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install necessary packages
RUN apk add --no-cache libc6-compat openssl

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 lightup

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder --chown=lightup:nodejs /app/dist ./dist

# Create necessary directories
RUN mkdir -p logs data
RUN chown -R lightup:nodejs logs data

# Switch to non-root user
USER lightup

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start production server
CMD ["npm", "start"]