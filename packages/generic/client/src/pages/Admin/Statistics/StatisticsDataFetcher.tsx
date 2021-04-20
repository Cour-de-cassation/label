import React, { ReactElement } from 'react';
import { apiRouteInType, apiRouteOutType, userType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { StatisticsDataFetcher };

function StatisticsDataFetcher(props: {
  children: (fetched: {
    aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
    refetch: (params: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter']) => void;
    ressourceFilter: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter'];
  }) => ReactElement;
}) {
  const statisticsFetchInfo = useApi(buildFetchStatistics(), { userId: undefined as userType['_id'] | undefined });

  return (
    <DataFetcher
      buildComponentWithData={(aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>) =>
        props.children({
          aggregatedStatistics,
          refetch: statisticsFetchInfo.refetch,
          ressourceFilter: statisticsFetchInfo.params,
        })
      }
      fetchInfo={statisticsFetchInfo}
    />
  );
}

function buildFetchStatistics() {
  return async ({ userId }: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter']) => {
    return apiCaller.get<'aggregatedStatistics'>('aggregatedStatistics', { ressourceFilter: { userId } });
  };
}
