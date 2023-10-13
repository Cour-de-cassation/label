#!/bin/bash
# To deploy locally docker containers as in prod environment

#yarn install --

#yarn compile

#yarn buildClient

docker build --target label-client -f Dockerfile.label-client -t label-client .

docker build --target label-backend -f Dockerfile.label-backend -t label-backend .

docker run -d -it -p 127.0.0.1:8081:55432 --env-file=./.env-sample-label-client label-client

docker run -d -it -p 127.0.0.1:8082:55432 --env-file=./.env-sample-label-backend label-backend

# erreur de serveur mongo, il faut lui donner une instance de mongo avec une base labelDb
