# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install wait-for-it script and debugging tools
RUN apk add --no-cache bash curl

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Debug: List contents of dist directory
RUN ls -la dist/

EXPOSE 3000

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Set NODE_ENV to production
ENV NODE_ENV=production

# Add debug logging
ENV DEBUG=*

# Use node directly with more verbose logging
CMD ["node", "--trace-warnings", "dist/main"] 