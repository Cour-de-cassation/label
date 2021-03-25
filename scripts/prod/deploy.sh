#!/bin/sh

echo "Stop LABEL service"
services LabelServerProd stop

echo "Free port"
fuser -k 55430/tcp

echo "Start LABEL service"
services LabelServerProd start
