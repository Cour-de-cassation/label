#!/bin/sh
set -e

echo "Check out prod version"
git checkout prod

echo "Pull last version"
git pull

echo "Install packages"
yarn

echo "Bootstrap"
yarn bootstrap

echo "Compile"
yarn build

echo "Run E2E test"
cd packages/courDeCassation
yarn testE2E
