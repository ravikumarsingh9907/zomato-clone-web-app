FROM node:16 AS builder

WORKDIR /app
COPY ./package*.json /app/

RUN npm install

COPY . /app/

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/public /app/public/
COPY --from=builder /app/src /app/src/

RUN npm install

EXPOSE 3000
CMD npm start

