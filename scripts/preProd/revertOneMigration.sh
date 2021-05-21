#!/bin/sh
set -e

cd packages/courDeCassation
echo "Revert the last run migration"
./scripts/runPreProdScript.sh dist/scripts/revertOneMigration.js
cd ../../
