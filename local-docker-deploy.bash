#!/bin/bash
# To deploy locally docker containers as in prod environment

yarn install --

yarn compile

yarn buildClient

docker build --target label-client -f Dockerfile.label-client -t label-client .

docker run -it -p 127.0.0.1:8081:55432 --env-file=./.env-sample-label-client label-client


