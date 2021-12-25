#!/bin/sh
set -e

echo "Check out prod version"
sudo -u label git checkout prod

echo "Pull last version"
sudo -u label git pull
docker pull opendatajustice/label-backend:latest
docker pull opendatajustice/label-client:latest

echo "Run new migrations"
./scripts/prod/runNewMigrations.sh

echo "Run E2E test"
cd packages/courDeCassation
yarn testE2EProd
