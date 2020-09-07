# Use a node 14 base image
ARG NODE_VERSION=14
FROM node:${NODE_VERSION}-alpine

# Create the app directory
WORKDIR /usr/src/app

# Copy context files
COPY package.json ./
COPY yarn.lock ./
COPY . .

# Install dependencies
RUN yarn install --pure-lockfile

# Start the app
ENTRYPOINT ["yarn", "start"]
