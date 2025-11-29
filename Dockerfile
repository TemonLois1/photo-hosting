# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
COPY backend/src ./backend/src

# Copy frontend files (for serving static files)
COPY frontend/package*.json ./frontend/
COPY frontend/public ./frontend/public
COPY frontend/src ./frontend/src

# Install backend dependencies only
WORKDIR /app/backend
RUN npm install --omit=dev

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start backend
CMD ["node", "src/server.js"]
