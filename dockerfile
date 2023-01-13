FROM node:14 AS build-stage

WORKDIR /app

# copy frontend folder to /app
# COPY . /app
COPY package.json /app/package.json

COPY src/ /app/src
COPY public/ /app/public
COPY environments/ /app/environments
COPY yarn.lock /app/yarn.lock
COPY tsconfig.json /app/tsconfig.json

#install dependencies
RUN yarn install

#build production app
RUN yarn run build:development

# FROM nginx:alpine
FROM caddy:alpine

COPY --from=build-stage /app/build /srv
COPY .config/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
