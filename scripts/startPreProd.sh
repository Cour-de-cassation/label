#!/bin/sh

startStaticServer () {
  cd packages/generic/client
  yarn serve -s build -l 55432 &
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
