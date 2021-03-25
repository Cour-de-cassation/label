#!/bin/sh

echo "Stop LABEL service"
systemctl stop LabelServer

echo "Free port"
fuser -k 55430/tcp

echo "Start LABEL service"
systemctl stop LabelServer
