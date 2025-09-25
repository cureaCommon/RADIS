# Build aşaması
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x node_modules/.bin/tsc
RUN npm run build



# Production aşaması
FROM node:20
WORKDIR /app
COPY --from=builder /app /app
COPY package*.json ./
RUN npm install -g serve
ENV NODE_ENV=production
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
