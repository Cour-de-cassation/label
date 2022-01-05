#!/bin/bash

./scripts/check_install.sh
export CURL="curl -s --retry 5 --retry-delay 2 --max-time 5"

if [ ! -z "${APP_SELF_SIGNED}" ];then
  export CURL="${CURL} -k"
fi;

if [ "${APP_ID}" == "label-backend" ];  then
  route=${ROOT_PATH}/health
else
  route=${ROOT_PATH}
fi
result=${APP_KEYWORD}

if ${CURL} "${APP_SCHEME}://${APP_HOST}:${APP_PORT}/${route}" | grep -q "${result}" ; then
  echo "✅  test ${APP_HOST}/${route} ";
else
  if (${CURL} -k "${APP_SCHEME}://${APP_HOST}:${APP_PORT}/${route}" | grep -q "${result}");then
    echo -e "\e[33m⚠️   test ${APP_HOST}/${route} (invalid SSL cert)\e[0m";
  else
    echo -e "\e[31m❌ test ${APP_HOST}/${route} !\e[0m";
    echo ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/${route};
    $(echo ${CURL} | sed 's/ \-s / /') ${APP_SCHEME}://{APP_HOST}:${APP_PORT}/${route};
    exit 1;
  fi;
fi;
