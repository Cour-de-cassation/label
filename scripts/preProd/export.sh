#!/bin/sh

cd packages/courDeCassation
echo "Export the treated documents to SDER database"
RUN_MODE=PREPROD node dist/crons/exportTreatedDocument.js  -e environments/preProdEnvironment.json -s settings/settings.json
cd ../../
