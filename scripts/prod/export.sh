#!/bin/sh
set -e

cd packages/courDeCassation
echo "Export the treated documents to SDER database"
RUN_MODE=PROD node dist/scripts/exportTreatedDocuments.js  -e environments/prodEnvironment.json -s settings/settings.json
cd ../../
