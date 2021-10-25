#!/bin/sh
set -e

echo "Update LABEL"
sudo -u label yarn updateProd

echo "Stop LABEL service"
sudo systemctl stop LabelServerProd

echo "Free port"
sudo -u label fuser -k 55430/tcp

echo "Start LABEL service"
sudo systemctl start LabelServerProd
