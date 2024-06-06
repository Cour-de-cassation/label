#!/bin/sh

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

cd packages/courDeCassation;

echo "Reset the DB except for users and migrations"
sh scripts/runLocalScript.sh ./dist/scripts/clearDb.js;

echo "Import the documents from SDER database"
sh scripts/runLocalScript.sh ./dist/scripts/importAllDocumentsFromSderSinceOrBetween.js --fromDaysAgo 2;

echo "Annotate all the documents with the NLP engine"
sh scripts/runLocalScript.sh ./dist/scripts/annotateDocumentsWithoutAnnotationsWithNlp.js;

echo "Insert mock values in DB"
sh scripts/runLocalScript.sh ./dist/scripts/initializeTestDb.js;

echo "Create initial cache"
sh scripts/runLocalScript.sh ./dist/scripts/renewCache.js --beforeMinutes=5;

