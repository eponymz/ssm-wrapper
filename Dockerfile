FROM node:12-alpine3.10

WORKDIR /app
ADD ./ /app
RUN npm install && npm link
