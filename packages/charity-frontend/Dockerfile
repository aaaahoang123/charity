# Build BASE
FROM node:lts-alpine as BASE
LABEL author="hoangdo"

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache git \
    && npm i -g pnpm \
    && pnpm i --frozen-lockfile \
    && pnpm store prune

# Build Image
FROM node:lts-alpine AS BUILD
LABEL author="hoangdo"

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && npm run build
#    && cd .next/standalone
    # Follow https://github.com/ductnn/Dockerfile/blob/master/nodejs/node/16/alpine/Dockerfile
    # && node-prune

# Build production
FROM node:lts-alpine AS PRODUCTION
LABEL author="hoangdo"

WORKDIR /app

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]