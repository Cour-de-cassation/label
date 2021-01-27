#!/bin/sh

SCRIPT_NAME="$1"
shift

echo RUN_MODE=PREPROD node $SCRIPT_NAME -e environments/preProdEnvironment.json -s settings/settings.json $@
RUN_MODE=PREPROD node $SCRIPT_NAME -e environments/preProdEnvironment.json -s settings/settings.json $@
