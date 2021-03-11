#!/bin/sh

git checkout master
git pull
git checkout pre-prod
git pull
git rebase master
git push
