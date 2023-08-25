import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { useApi, apiCaller } from '../../../api';
import { DataFetcher } from '../../../pages/DataFetcher';

export { PersonalStatisticsDataFetcher };

function PersonalStatisticsDataFetcher(props: {
  children: (fetched: {
    personalStatistics: apiRouteOutType<'get', 'personalStatistics'>;
    refetch: () => void;
  }) => ReactElement;
}) {
  const personalStatisticsInfo = useApi(buildFetchPersonalStatistics(), {});

  return (
    <DataFetcher
      buildComponentWithData={(personalStatistics: apiRouteOutType<'get', 'personalStatistics'>) =>
        props.children({ personalStatistics, refetch: () => personalStatisticsInfo.refetch({}) })
      }
      fetchInfo={personalStatisticsInfo}
      route={'personalStatistics'}
    />
  );
}

function buildFetchPersonalStatistics() {
  return async () => {
    const { data, statusCode } = await apiCaller.get<'personalStatistics'>('personalStatistics');

    return {
      data,
      statusCode,
    };
  };
}
