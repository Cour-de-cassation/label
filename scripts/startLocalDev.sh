#!/bin/sh

DIR=`dirname "$0"`

$DIR/initializeTestDb.sh

lerna run --scope @label/demo startLocal --stream
