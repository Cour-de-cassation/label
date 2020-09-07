# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --pure-lockfile

# add app
COPY . .

# build the app
RUN yarn build

# start app
CMD ["yarn", "start"]
