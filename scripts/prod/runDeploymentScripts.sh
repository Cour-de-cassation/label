#!/bin/sh

cd packages/courDeCassation
echo "Run deployment scripts"
./scripts/runProdScript.sh dist/scripts/runDeploymentScripts.js
cd ../../
