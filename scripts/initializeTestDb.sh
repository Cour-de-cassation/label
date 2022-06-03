#!/bin/sh

cd packages/courDeCassation
echo "Reset the DB except for users and migrations"
RUN_MODE=LOCAL node dist/scripts/clearDb.js -e environments/localEnvironment.json -s settings/settings.json
echo "Import the documents from SDER database"
RUN_MODE=LOCAL node dist/scripts/importAllDocumentsFromSderSince.js --days 2  -e environments/localEnvironment.json -s settings/settings.json
echo "Annotate all the documents with the NLP engine"
RUN_MODE=LOCAL node dist/scripts/annotateDocumentsWithoutAnnotationsWithNlp.js  -e environments/localEnvironment.json -s settings/settings.json
echo "Insert mock values in DB"
RUN_MODE=LOCAL node dist/scripts/initializeTestDb.js -e environments/localEnvironment.json -s settings/settings.json
echo "Create initial cache"
RUN_MODE=LOCAL node dist/scripts/renewCache.js --beforeMinutes=5 -e environments/localEnvironment.json -s settings/settings.json

cd ../../
