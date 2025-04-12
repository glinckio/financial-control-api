FROM node:lts-alpine

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install

ARG APP_PORT=3003
ENV APP_PORT=$APP_PORT

EXPOSE ${APP_PORT}

ENV NODE_ENV=development

RUN mkdir -p /app/node_modules/.bin && chown -R node:node /app
USER node

CMD ["yarn", "start:dev"]