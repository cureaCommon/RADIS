# Build aşaması
FROM node:20 AS builder
WORKDIR /app

# package.json ve package-lock.json'u kopyala
COPY package.json package-lock.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm kaynak kodu kopyala
COPY . .

# Build işlemi
RUN npm run build

# Production aşaması
FROM node:20-alpine
WORKDIR /app

# Alpine'de gerekli paketleri ekle
RUN apk add --no-cache bash curl git python3 make g++

# Builder'dan tüm dosyaları al
COPY --from=builder /app /app

ENV NODE_ENV=production

# serve paketini global kur
RUN npm install -g serve

EXPOSE 3001

# FE'yi başlat
CMD ["npm", "start"]
