import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { AgentsDataFetcher };

function AgentsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'> }) => ReactElement;
}) {
  const treatmentsWithDetailsFetchInfo = useApi(buildFetchAgents());

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>) =>
        props.children({ usersWithDetails })
      }
      fetchInfo={treatmentsWithDetailsFetchInfo}
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
