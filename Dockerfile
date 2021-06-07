# PROD CONFIG
FROM node:14.16.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

COPY ./jest-ie.config.js ./jest-ie.config.js
COPY ./ie-tests ./ie-tests

CMD ["npm", "run", "start"]

