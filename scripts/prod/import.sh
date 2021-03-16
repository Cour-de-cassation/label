#!/bin/sh

cd packages/courDeCassation
echo "Import the documents from SDER database"
RUN_MODE=PROD node dist/crons/importAllDocumentsFromSderSince.js --days 2  -e environments/prodEnvironment.json -s settings/settings.json
echo "Annotate all the documents with the NLP engine"
RUN_MODE=PROD node dist/crons/annotateDocumentsWithoutAnnotationsWithNlp.js  -e environments/prodEnvironment.json -s settings/settings.json
cd ../../
