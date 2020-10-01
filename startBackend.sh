#!/bin/sh

# Clear the Db for a fresh start
echo "Clear the Db for a fresh start"
cd packages/generic/backend
RUN_MODE=LOCAL node dist/scripts/clearDb.js
cd ../../../

# Import the documents from Jurinet
echo "Import the documents from Jurinet"
cd packages/courDeCassation/jurinetConnector
RUN_MODE=LOCAL node dist/crons/importAllDocumentsFromJurinet.js
cd ../../../

# Annotate all the documents with the NLP engine
echo "Annotate all the documents with the NLP engine"
cd packages/courDeCassation/nlpAnnotator
RUN_MODE=LOCAL node dist/crons/annotateDocumentsWithoutAnnotationsWithNlp.js
cd ../../../

yarn backendStart
