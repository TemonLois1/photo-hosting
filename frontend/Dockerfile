# Frontend Dockerfile - Multi-stage build
# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src
COPY public ./public

RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
