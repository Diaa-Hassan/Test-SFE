# syntax=docker/dockerfile:1
FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install
ENV PORT 7000
CMD ["npm","run", "dev"]