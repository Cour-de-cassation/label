#!/bin/sh
set -e

echo "Check out pre prod version"
git checkout pre-prod

echo "Pull last version"
git pull

echo "Install packages"
yarn

echo "Bootstrap"
yarn bootstrap

echo "Compile"
yarn build

echo "Run new migrations"
./scripts/preProd/runNewMigrations.sh

echo "Run E2E test"
cd packages/courDeCassation
yarn testE2EPreProd
