#!/bin/sh

echo "Stop LABEL service"
systemctl stop LabelServerProd

echo "Free port"
fuser -k 55430/tcp

echo "Start LABEL service"
systemctl stop LabelServerProd
