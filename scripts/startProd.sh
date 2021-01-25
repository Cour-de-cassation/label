#!/bin/sh

DIR=`dirname "$0"`

$DIR/initializeTestDb.sh

cd packages/generic/client && yarn serve -s build -l 55432 && cd ../../.. & lerna run --scope @label/cour-de-cassation startProd --stream
