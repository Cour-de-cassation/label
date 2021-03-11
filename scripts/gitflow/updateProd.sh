#!/bin/sh

git checkout pre-prod
git pull
git checkout prod
git pull
git rebase pre-prod
git push
