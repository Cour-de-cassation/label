#!/bin/sh

#### Docker Compose files
mv ./packages/demo/templates/docker-compose-dev.yml ./
mv ./packages/demo/templates/docker-compose-dev-client.yml ./
mv ./packages/demo/templates/docker-compose.yml ./

#### Starting scripts
mv ./packages/demo/templates/startLocal.sh ./scripts
mv ./packages/demo/templates/startPreProd.sh ./scripts
mv ./packages/demo/templates/startProd.sh ./scripts
chmod +x ./scripts/startLocal.sh
chmod +x ./scripts/startPreProd.sh
chmod +x ./scripts/startProd.sh
