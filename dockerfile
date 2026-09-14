FROM node:24.11.1-alpine

WORKDIR /app/

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]