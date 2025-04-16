FROM node:lts-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json yarn.lock* ./

RUN mkdir -p /app/node_modules/.bin && \
    chown -R node:node /app

USER node

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn prisma generate

RUN yarn build

ARG APP_PORT=3003
ENV APP_PORT=$APP_PORT
ENV NODE_ENV=development

EXPOSE ${APP_PORT}

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost:${APP_PORT}/health || exit 1

CMD ["sh", "-c", "yarn prisma generate && yarn start:dev"]