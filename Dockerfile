
# syntax=docker/dockerfile:1.0.0-experimental
# Stage 0, "build-stage" to build and compile the frontend
FROM node:14.15.0-alpine as build-stage

RUN apk update && \
  apk upgrade && \
  apk add git && \
  apk add openssh-client

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

RUN --mount=type=ssh,id=github yarn install

COPY ./ /app/

ARG BASE_URL
ARG ISSUER_DID
ENV REACT_APP_BASE_URL=${BASE_URL}
ENV REACT_APP_ISSUER_DID=${ISSUER_DID}

RUN yarn build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf