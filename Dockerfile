# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.2.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/root/.npm \
	npm ci --omit=dev

# Copy the init script first
COPY init-scripts/init-gallery.sh /usr/src/app/init-gallery.sh

# Copy init scripts into MySQL init directory inside the image
COPY init-scripts/ /docker-entrypoint-initdb.d/

# Copy the rest of the source files into the image.
COPY . .

# Backup the original gallery folder for initialization
RUN if [ -d "/usr/src/app/src/public/gallery" ]; then \
	cp -r /usr/src/app/src/public/gallery /usr/src/app/gallery_backup; \
	fi

# Set permissions
RUN chmod +x /usr/src/app/init-gallery.sh && \
	chown -R node:node /usr/src/app

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3305

# Use the initialization script as entrypoint
ENTRYPOINT ["/usr/src/app/init-gallery.sh"]
#CMD ["node", "src/server.js"]