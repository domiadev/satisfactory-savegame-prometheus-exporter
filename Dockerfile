ARG NODE_VERSION=22.8.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm ci
RUN npm run build

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
# USER node

# Expose the port that the application listens on.
EXPOSE 9772

ENV NODE_OPTIONS=--enable-source-maps

# Run the web server
CMD ["npm", "exec", "express"]
