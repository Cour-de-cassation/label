#!/bin/sh

#### Docker Compose files
mv ./packages/courDeCassation/templates/docker-compose-dev.yml ./
mv ./packages/courDeCassation/templates/docker-compose-dev-client.yml ./
mv ./packages/courDeCassation/templates/docker-compose.yml ./

#### Starting scripts
mv ./packages/courDeCassation/templates/startLocal.sh ./scripts
mv ./packages/courDeCassation/templates/startPreProd.sh ./scripts
mv ./packages/courDeCassation/templates/startProd.sh ./scripts
chmod +x ./scripts/startLocal.sh
chmod +x ./scripts/startPreProd.sh
chmod +x ./scripts/startProd.sh
