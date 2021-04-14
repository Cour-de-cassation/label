#!/bin/sh
set -e

echo "Update LABEL"
yarn updateProd

echo "Stop LABEL service"
systemctl stop LabelServerProd

echo "Free port"
fuser -k 55430/tcp

echo "Start LABEL service"
systemctl start LabelServerProd
