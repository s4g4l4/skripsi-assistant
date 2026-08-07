# Multi-stage Dockerfile for Dukun Skripsi / Express + React Application

# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy application source
COPY . .

# Build frontend and server bundle
ENV NODE_ENV=production
RUN npm run build

# --- Stage 2: Production Runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets and compiled server from builder stage
COPY --from=builder /app/dist ./dist

# Expose container port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start Node production server
CMD ["node", "dist/server.cjs"]
