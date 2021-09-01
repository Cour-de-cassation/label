import React, { ReactElement } from 'react';
import { apiRouteOutType, httpStatusCodeHandler, ressourceFilterType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { StatisticsDataFetcher };

function StatisticsDataFetcher(props: {
  children: (fetched: {
    availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
    aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
    refetch: (ressourceFilter: ressourceFilterType) => void;
    isLoading: boolean;
    ressourceFilter: ressourceFilterType;
  }) => ReactElement;
}) {
  const statisticsFetchInfo = useApi(buildFetchStatistics(), {
    source: undefined,
    userId: undefined,
  } as ressourceFilterType);

  return (
    <DataFetcher
      buildComponentWithData={({ availableStatisticFilters, aggregatedStatistics }) =>
        props.children({
          availableStatisticFilters,
          aggregatedStatistics,
          refetch: statisticsFetchInfo.refetch,
          isLoading: !statisticsFetchInfo.isLoaded,
          ressourceFilter: statisticsFetchInfo.params,
        })
      }
      fetchInfo={statisticsFetchInfo}
    />
  );
}

function buildFetchStatistics() {
  return async (ressourceFilter: ressourceFilterType) => {
    const { data: availableStatisticFilters, statusCode: statusCodeAvailableStatisticFilters } = await apiCaller.get<
      'availableStatisticFilters'
    >('availableStatisticFilters');
    const { data: aggregatedStatistics, statusCode: statusCodeAggregatedStatistics } = await apiCaller.get<
      'aggregatedStatistics'
    >('aggregatedStatistics', { ressourceFilter });

    return {
      data: { availableStatisticFilters, aggregatedStatistics },
      statusCode: httpStatusCodeHandler.merge([statusCodeAvailableStatisticFilters, statusCodeAggregatedStatistics]),
    };
  };
}
