#!/bin/bash
if [ -z "${KUBECONFIG}" ];then
	export KUBECONFIG=$HOME/.kube/config-local-k3s.yaml
fi
for APP_ID in label-backend label-client;do
    export eval $(cat .env-sample-${APP_ID});
    if [ "${APP_ID}" == "label-client" ]; then
        if [ ! -d packages/generic/client/build ];then 
            yarn buildClient;
        fi
    else
        if [ ! -d packages/generic/backend/dist ];then 
            yarn compile;
        fi
    fi
    (docker stop ${APP_ID};docker rm ${APP_ID};docker image rm ${DOCKER_USERNAME}/${APP_ID}:$(./scripts/version.sh);) > /dev/null 2>&1;
    export DOCKER_TARGET=${APP_ID};
    ./scripts/docker-build.sh || exit 1;
    ./scripts/deploy_k8s_services.sh || exit 1;
    ./scripts/test_minimal.sh || exit 1;
done
