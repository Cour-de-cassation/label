#!/bin/sh

SCRIPT_NAME="$1"
shift

echo RUN_MODE=PROD node $SCRIPT_NAME -s settings/settings.json $@
RUN_MODE=PROD node $SCRIPT_NAME -s settings/settings.json $@
