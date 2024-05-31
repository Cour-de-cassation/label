#!/bin/sh

echo "Reset the DB except for users and migrations"
RUN_MODE=LOCAL node packages/courDeCassation/dist/scripts/clearDb.js -s packages/courDeCassation/settings/settings.json
echo "Import the documents from SDER database"
RUN_MODE=LOCAL node packages/courDeCassation/dist/scripts/importAllDocumentsFromSderSinceOrBetween.js --fromDaysAgo 2 -s packages/courDeCassation/settings/settings.json
echo "Annotate all the documents with the NLP engine"
RUN_MODE=LOCAL node packages/courDeCassation/dist/scripts/annotateDocumentsWithoutAnnotationsWithNlp.js -s packages/courDeCassation/settings/settings.json
echo "Insert mock values in DB"
RUN_MODE=LOCAL node packages/courDeCassation/dist/scripts/initializeTestDb.js -s packages/courDeCassation/settings/settings.json
echo "Create initial cache"
RUN_MODE=LOCAL node packages/courDeCassation/dist/scripts/renewCache.js --beforeMinutes=5 -s packages/courDeCassation/settings/settings.json

