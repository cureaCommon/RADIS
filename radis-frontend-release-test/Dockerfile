# Build aşaması
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .
RUN npm run build

# Production
FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y bash curl git python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app /app
ENV NODE_ENV=production
RUN npm install -g serve
EXPOSE 3002
CMD ["serve", "-s", "dist", "-l", "3002"]
