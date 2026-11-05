FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 80

CMD ["sh", "-c", "npm run db:migrate && node dist/server.js"]