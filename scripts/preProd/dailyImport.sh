#!/bin/sh

cd packages/courDeCassation
echo "Import the documents from SDER database"
RUN_MODE=PREPROD node dist/crons/importAllDocumentsFromSder.js  -e environments/preProdEnvironment.json -s settings/settings.json
echo "Annotate all the documents with the NLP engine"
RUN_MODE=PREPROD node dist/crons/annotateDocumentsWithoutAnnotationsWithNlp.js  -e environments/preProdEnvironment.json -s settings/settings.json
cd ../../
