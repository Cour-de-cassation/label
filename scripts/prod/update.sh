#!/bin/sh
set -e

echo "Check out prod version"
git checkout prod

echo "Pull last version"
git pull
docker pull opendatajustice/label-backend:latest
docker pull opendatajustice/label-client:latest

echo "Run new migrations"
./scripts/prod/runNewMigrations.sh

echo "Run E2E test"
cd packages/courDeCassation
yarn testE2EProd || echo "e2etest now fail because of the score nlp api"
