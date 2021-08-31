#!/bin/sh
set -e

cd packages/courDeCassation
echo "Revert the last run migration"
./scripts/runProdScript.sh dist/scripts/revertOneMigration.js
cd ../../
