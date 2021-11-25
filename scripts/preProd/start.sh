#!/bin/sh
set -e

startStaticServer () {
  cd packages/generic/client
  REACT_APP_RUN_MODE=PREPROD npx superstatic ./build --port 55432 &
  yarn_serve_pid=$!
  cd ../../..
}

stopStaticServer () {
  kill $yarn_serve_pid > /dev/null 2>&1
}

trap stopStaticServer EXIT
trap stopStaticServer INT

startStaticServer
lerna run --scope @label/cour-de-cassation startPreProd --stream
