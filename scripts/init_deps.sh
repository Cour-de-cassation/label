#!/bin/bash

export DEPS_SRC=$(pwd)/judilibre-admin
export SCRIPTS_SRC=${DEPS_SRC}/scripts
export KUBE_SRC=${DEPS_SRC}/k8s

# clone
if [ ! -d ${SCRIPTS_SRC} ];then
    if ! (git clone https://oauth2:${GIT_TOKEN}@github.com/Cour-de-cassation/judilibre-admin > /dev/null 2>&1); then
        echo -e "\e[31m❌ init failed, couldn't clone git judilibre-admin repository \e[0m" && exit 1;
        if [ "${GIT_BRANCH}" == "master" ]; then
            cd judilibre-admin;
            git checkout master;
            cd ..;
        fi;
    fi;
fi;

# scripts

for file in check_install docker-check docker-build deploy_k8s_services wait_services_readiness; do
    if [ ! -f "./scripts/${file}.sh" ]; then
        ln -s ${SCRIPTS_SRC}/${file}.sh ./scripts/${file}.sh;
    fi;
done;

# kube configs
for file in $(ls ${KUBE_SRC}); do
    if [ ! -f "./k8s/$file" ]; then
        ln -s ${KUBE_SRC}/$file ./k8s/$file;
    fi;
done;

