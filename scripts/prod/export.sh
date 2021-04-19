#!/bin/sh
set -e

cd packages/courDeCassation
echo "Export the treated documents to SDER database"
RUN_MODE=PROD node dist/scripts/exportTreatedDocumentsSince.js  -e environments/prodEnvironment.json -s settings/settings.json --days 3
cd ../../
