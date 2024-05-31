#!/bin/sh

cd packages/courDeCassation
echo "Create an empty migration file"
RUN_MODE=LOCAL node dist/scripts/createMigrationFile.js -s settings/settings.json
