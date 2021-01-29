#!/bin/sh

cd packages/courDeCassation
echo "Init db with test user"
RUN_MODE=PREPROD node dist/scripts/initializeTestDb.js  -e environments/preProdEnvironment.json -s settings/settings.json
