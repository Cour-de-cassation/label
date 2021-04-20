import React, { ReactElement } from 'react';
import { apiRouteOutType, userType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { StatisticsDataFetcher };

function StatisticsDataFetcher(props: {
  children: (fetched: {
    aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
    refetch: (params: { userId: userType['_id'] | undefined }) => void;
  }) => ReactElement;
}) {
  const statisticsFetchInfo = useApi(buildFetchStatistics(), { userId: undefined as userType['_id'] | undefined });

  return (
    <DataFetcher
      buildComponentWithData={(aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>) =>
        props.children({ aggregatedStatistics, refetch: statisticsFetchInfo.refetch })
      }
      fetchInfo={statisticsFetchInfo}
    />
  );
}

function buildFetchStatistics() {
  return async ({ userId }: { userId: userType['_id'] | undefined }) => {
    return apiCaller.get<'aggregatedStatistics'>('aggregatedStatistics', { ressourceFilter: { userId } });
  };
}
