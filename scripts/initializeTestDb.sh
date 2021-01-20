#!/bin/sh

cd packages/generic/backend
echo "Clear the Db for a fresh start"
RUN_MODE=LOCAL node dist/scripts/clearDb.js
echo "Insert user for testing purpose"
RUN_MODE=LOCAL node dist/scripts/insertTestUsers.js
cd ../../../

cd packages/courDeCassation
echo "Import the documents from SDER database"
RUN_MODE=LOCAL node dist/legacy/crons/importAllDocumentsFromJurinet.js
echo "Annotate all the documents with the NLP engine"
RUN_MODE=LOCAL node dist/crons/annotateDocumentsWithoutAnnotationsWithNlp.js
cd ../../
