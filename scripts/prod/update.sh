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

#echo "Run E2E test"
NLP_API_IP=$(host nlp-pseudonymisation-api.judilibre-prive.local| grep 'has address' | awk '{print $NF}')
docker run --rm -e NODE_TLS_REJECT_UNAUTHORIZED=0 --add-host nlp-pseudonymisation-api.judilibre-prive.local:${NLP_API_IP} opendatajustice/label-backend:latest yarn testE2EProd || echo fail
