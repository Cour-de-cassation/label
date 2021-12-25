#!/bin/sh
set -e

echo "Update LABEL"
yarn updateProd

echo "Stop LABEL service"
sudo systemctl stop LabelServerProd || echo
( docker stop label-backend label-client && docker container rm label-backend label-client ) || echo

echo "Free port"
sudo -u label fuser -k 55430/tcp || echo

echo "Start LABEL service"
docker run -d -p 55430:80 --restart always --name label-client opendatajustice/label-client:latest
docker run -d -p 55432:55432 --restart always --name label-backend opendatajustice/label-backend:latest
