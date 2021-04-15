import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { StatisticsDataFetcher };

function StatisticsDataFetcher(props: {
  children: (fetched: { aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'> }) => ReactElement;
}) {
  const statisticsFetchInfo = useApi(buildFetchStatistics());

  return (
    <DataFetcher
      buildComponentWithData={(aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>) =>
        props.children({ aggregatedStatistics })
      }
      fetchInfo={statisticsFetchInfo}
    />
  );
}

function buildFetchStatistics() {
  return async () => {
    return apiCaller.get<'aggregatedStatistics'>('aggregatedStatistics', { ressourceFilter: { userId: undefined } });
  };
}
