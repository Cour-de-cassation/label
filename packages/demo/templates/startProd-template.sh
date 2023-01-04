#!/bin/sh

cd packages/generic/client && yarn serve -s build -l {clientPort} && cd ../../.. & lerna run --scope @label/cour-de-cassation startProd --stream
