#!/bin/sh
set -e

cd packages/courDeCassation
echo "Export the treated documents to SDER database"
RUN_MODE=PREPROD node dist/scripts/exportTreatedDocumentsSince.js  -e environments/preProdEnvironment.json -s settings/settings.json --days 3
cd ../../
