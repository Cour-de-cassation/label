#!/bin/sh

cd packages/courDeCassation
echo "Export the treated documents to SDER database"
RUN_MODE=PROD node dist/crons/exportTreatedDocuments.js  -e environments/prodEnvironment.json -s settings/settings.json
cd ../../
