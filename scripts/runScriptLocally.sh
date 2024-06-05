#!/bin/sh

SCRIPT_NAME="$1"
shift

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

cd packages/courDeCassation;

sh scripts/runLocalScript.sh ./dist/scripts/$SCRIPT_NAME
