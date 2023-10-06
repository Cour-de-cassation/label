import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { WorkingUsersDataFetcher };

function WorkingUsersDataFetcher(props: {
  children: (fetched: { workingUsers: apiRouteOutType<'get', 'workingUsers'>; refetch: () => void }) => ReactElement;
}) {
  const workingUsersFetchInfo = useApi(buildFetchWorkingUsers(), {});

  return (
    <DataFetcher
      buildComponentWithData={(workingUsers: apiRouteOutType<'get', 'workingUsers'>) =>
        props.children({ workingUsers, refetch: workingUsersFetchInfo.refetch })
      }
      fetchInfo={workingUsersFetchInfo}
      route={'workingUsers'}
    />
  );
}

function buildFetchWorkingUsers() {
  return async () => {
    const { data: workingUsers, statusCode } = await apiCaller.get<'workingUsers'>('workingUsers');

    return {
      data: workingUsers.map((workingUser) => ({
        ...workingUser,
        _id: idModule.lib.buildId(workingUser._id),
      })),
      statusCode,
    };
  };
}
