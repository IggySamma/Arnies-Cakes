# syntax=docker/dockerfile:1

FROM node:24.17-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install dependencies (cached layer)
RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/root/.npm \
	npm ci --omit=dev

# Copy application source
COPY . .

# Set permissions
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3305

CMD ["node", "src/server.js"]