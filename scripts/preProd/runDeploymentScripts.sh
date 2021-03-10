#!/bin/sh

cd packages/courDeCassation
echo "Run deployment scripts"
./scripts/runPreProdScript.sh dist/scripts/runDeploymentScripts.js
cd ../../
