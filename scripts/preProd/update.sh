#!/bin/sh

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

echo "Run E2E test"
cd packages/courDeCassation
yarn testE2E
