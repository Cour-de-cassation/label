#!/bin/sh
set -x
set -e

./scripts/runPreProdScript.sh dist/scripts/clearDbExceptUsers.js

./scripts/runPreProdScript.sh dist/scripts/importAllDocumentsFromSderSince.js --days 7

./scripts/runPreProdScript.sh dist/scripts/annotateDocumentsWithoutAnnotationsWithNlp.js
