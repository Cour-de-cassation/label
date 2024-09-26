#!/bin/sh

SCRIPT_NAME="$1"
shift

echo node $SCRIPT_NAME -s settings/settings.json $@
node $SCRIPT_NAME -s settings/settings.json $@
