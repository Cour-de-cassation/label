import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { StatisticsDataFetcher };

function StatisticsDataFetcher(props: {
  children: (fetched: { statistics: apiRouteOutType<'get', 'statistics'> }) => ReactElement;
}) {
  const statisticsFetchInfo = useApi(buildFetchStatistics());

  return (
    <DataFetcher
      buildComponentWithData={(statistics: apiRouteOutType<'get', 'statistics'>) => props.children({ statistics })}
      fetchInfo={statisticsFetchInfo}
    />
  );
}

function buildFetchStatistics() {
  return async () => {
    const { data: statistics, statusCode } = await apiCaller.get<'statistics'>('statistics');

    return {
      data: statistics.map((statistic) => ({
        ...statistic,
        _id: idModule.lib.buildId(statistic._id),
        userId: idModule.lib.buildId(statistic.userId),
      })),
      statusCode,
    };
  };
}
