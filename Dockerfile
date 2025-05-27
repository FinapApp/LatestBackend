FROM node:18-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm install -g typescript && tsc

FROM node:18-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 4002
CMD ["node", "dist/app.js"]
