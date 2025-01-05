FROM node:20.9.0-alpine

RUN apk add bash

RUN npm install env-cmd -g

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .