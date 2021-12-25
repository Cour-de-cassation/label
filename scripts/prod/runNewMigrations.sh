#!/bin/sh
set -e

echo "Run new migrations"
docker run opendatajustice/label-backend ./scripts/runProdScript.sh dist/scripts/runNewMigrations.js
cd ../../
