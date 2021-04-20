import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { AgentsDataFetcher };

function AgentsDataFetcher(props: {
  children: (fetched: { usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'> }) => ReactElement;
}) {
  const usersWithDetailsFetchInfo = useApi(buildFetchAgents(), {});

  return (
    <DataFetcher
      buildComponentWithData={(usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>) =>
        props.children({ usersWithDetails })
      }
      fetchInfo={usersWithDetailsFetchInfo}
    />
  );
}

function buildFetchAgents() {
  return async () => {
    const { data: usersWithDetails, statusCode } = await apiCaller.get<'usersWithDetails'>('usersWithDetails');

    return {
      data: usersWithDetails.map((userWithDetails) => ({
        ...userWithDetails,
        user: {
          ...userWithDetails.user,
          _id: idModule.lib.buildId(userWithDetails.user._id),
        },
      })),
      statusCode,
    };
  };
}
