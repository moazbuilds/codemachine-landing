# Dockerfile for CodeMachine Landing Page
# Uses node:20-alpine for minimal image size and matches CI parity requirements

FROM node:20-alpine AS base

# Install system dependencies required for build tools
RUN apk add --no-cache \
    bash \
    git \
    openssl \
    python3 \
    make \
    g++ \
    libc6-compat

# Enable Corepack for pnpm support
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# ============================================
# Dependencies Stage
# ============================================
FROM base AS dependencies

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile for reproducibility
RUN pnpm install --frozen-lockfile --prod=false

# ============================================
# Build Stage
# ============================================
FROM base AS builder

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY . .

# Run the build process
RUN pnpm run build

# ============================================
# Production Stage
# ============================================
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (optional - for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================
# Development Stage (for local development)
# ============================================
FROM base AS development

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies including dev dependencies
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Start development server
CMD ["pnpm", "run", "dev"]
