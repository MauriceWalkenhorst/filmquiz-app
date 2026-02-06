# Film Quiz - Dockerfile for Render.com
FROM node:20-alpine

WORKDIR /app

# Install SQLite dependencies
RUN apk add --no-cache python3 make g++

# Copy and install backend dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src

# Copy frontend
COPY frontend/ ./frontend/

# Initialize database
RUN node src/database/init.js

EXPOSE 3000

CMD ["node", "src/server.js"]
