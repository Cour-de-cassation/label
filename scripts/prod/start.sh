#!/bin/sh
set -e

cd packages/generic/client && REACT_APP_RUN_MODE=PROD npx superstatic ./build --port 55432 --host 0.0.0.0 && cd ../../.. & lerna run --scope @label/cour-de-cassation startProd --stream

