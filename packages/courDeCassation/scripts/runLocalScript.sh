#!/bin/sh

SCRIPT_NAME="$1"
shift

echo RUN_MODE=LOCAL node $SCRIPT_NAME -s settings/settings.json $@
RUN_MODE=LOCAL node $SCRIPT_NAME -s settings/settings.json $@
