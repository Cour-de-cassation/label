#!/bin/sh
set -e

cd packages/courDeCassation
echo "Run new migrations"
./scripts/runPreProdScript.sh dist/scripts/runNewMigrations.js
cd ../../
