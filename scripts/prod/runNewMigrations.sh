#!/bin/sh
set -e

cd packages/courDeCassation
echo "Run new migrations"
./scripts/runProdScript.sh dist/scripts/runNewMigrations.js
cd ../../
