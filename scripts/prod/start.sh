#!/bin/sh
set -e

cd packages/generic/client && REACT_APP_RUN_MODE=PROD yarn serve -s build -l 55432 && cd ../../.. & lerna run --scope @label/cour-de-cassation startProd --stream
