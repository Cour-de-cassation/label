#!/bin/sh
set -e

cd packages/courDeCassation
echo "Import the documents from SDER database"
RUN_MODE=PREPROD node dist/crons/importAllDocumentsFromSderSince.js --days 2  -e environments/preProdEnvironment.json -s settings/settings.json
echo "Annotate all the documents with the NLP engine"
RUN_MODE=PREPROD node dist/crons/annotateDocumentsWithoutAnnotationsWithNlp.js  -e environments/preProdEnvironment.json -s settings/settings.json
cd ../../
