import React, { ReactElement } from 'react';
import { httpStatusCodeHandler } from 'sder-core';
import { apiRouteOutType, ressourceFilterType } from '@label/core';
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

    let aggregatedStatistics = {
      cumulatedValue: {
        surAnnotationsCount: 0,
        subAnnotationsSensitiveCount: 0,
        subAnnotationsNonSensitiveCount: 0,
        treatmentDuration: 0,
        annotationsCount: 0,
        wordsCount: 0,
      },
      total: -1,
    };
    let statusCodeAggregatedStatistics = 200;

    if (
      Object.values(ressourceFilter).some((e) => {
        return !!e;
      })
    ) {
      const { data: aggregatedStatisticsFetch, statusCode: statusCodeAggregatedStatisticsFetch } = await apiCaller.get<
        'aggregatedStatistics'
      >('aggregatedStatistics', { ressourceFilter });
      aggregatedStatistics = aggregatedStatisticsFetch;
      statusCodeAggregatedStatistics = statusCodeAggregatedStatisticsFetch;
    }

    return {
      data: { availableStatisticFilters, aggregatedStatistics },
      statusCode: httpStatusCodeHandler.merge([statusCodeAvailableStatisticFilters, statusCodeAggregatedStatistics]),
    };
  };
}
