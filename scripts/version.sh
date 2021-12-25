#!/bin/sh

export OS_TYPE=$(cat /etc/os-release | grep -E '^NAME=' | sed 's/^.*debian.*$/DEB/I;s/^.*ubuntu.*$/DEB/I;s/^.*fedora.*$/RPM/I;s/.*centos.*$/RPM/I;')

if ! (which jq > /dev/null 2>&1); then
        if [ "${OS_TYPE}" = "DEB" ]; then
                sudo apt-get install -yqq jq;
        fi;
        if [ "${OS_TYPE}" = "RPM" ]; then
                sudo yum install -y jq;
        fi;
fi

if [ -z "${APP_ID}" ]; then
  packages="label-client label-backend";
else
  packages=${APP_ID};
fi; 

for package in $packages; do
  echo $([ -z "${APP_ID}" ] && echo $package:)$( ( [ -f "package.json" ] && (cat package.json | jq -r '.version') ) || ( [ -f "setup.py" ] && ( grep -r __version__ */__init__.py | sed 's/.*=//;s/"//g;s/\s//g' ) ) || (git tag | tail -1) )-$(export LC_COLLATE=C;export LC_ALL=C;cat tagfiles.${package}.version | xargs -I '{}' find {} -type f | egrep -v '(.tar.gz)$' | sort | xargs cat | sha256sum - | sed 's/\(......\).*/\1/')
done;
