#!/bin/sh
set -e

echo "Run new migrations"
docker run --rm opendatajustice/label-backend:latest ./scripts/runProdScript.sh dist/scripts/runNewMigrations.js
