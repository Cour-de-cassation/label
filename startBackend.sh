#!/bin/sh

cd packages/generic/backend
echo "Clear the Db for a fresh start"
RUN_MODE=LOCAL node dist/scripts/clearDb.js
echo "Insert user for testing purpose"
RUN_MODE=LOCAL node dist/scripts/insertTestUsers.js
cd ../../../

cd packages/courDeCassation/jurinetConnector
echo "Import the documents from Jurinet"
RUN_MODE=LOCAL node dist/crons/importAllDocumentsFromJurinet.js
cd ../../../

cd packages/courDeCassation/nlpAnnotator
echo "Annotate all the documents with the NLP engine"
RUN_MODE=LOCAL node dist/crons/annotateDocumentsWithoutAnnotationsWithNlp.js
cd ../../../

yarn backendStart
