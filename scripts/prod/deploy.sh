#!/bin/sh
set -e

echo "Update LABEL"
yarn updateProd

echo "Stop LABEL service"
( docker stop label-backend label-client && docker container rm label-backend label-client ) || echo

echo "Start LABEL service"
docker run -d -p 55432:55432 --restart always --name label-client opendatajustice/label-client:latest
docker run -d -p 55430:55430 --restart always --name label-backend opendatajustice/label-backend:latest
