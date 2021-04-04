FROM node:12-alpine
ENV NODE_ENV=production
EXPOSE 4000

WORKDIR /app
COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]