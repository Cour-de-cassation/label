import React, { ReactElement } from 'react';
import { apiRouteInType, apiRouteOutType } from '@label/core';
import { AgentsDataFetcher } from './Agents/AgentsDataFetcher';
import { ProblemReportsDataFetcher } from './ProblemReports/ProblemReportsDataFetcher';
import { TreatedDocumentsDataFetcher } from './TreatedDocuments/TreatedDocumentsDataFetcher';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocuments/UntreatedDocumentsDataFetcher';
import { StatisticsDataFetcher } from './Statistics/StatisticsDataFetcher';

export { AdminInfosDataFetcher };

type adminInfosType = {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
  usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>;
};

type refetchInfosType = {
  untreatedDocuments: () => void;
  problemReportsWithDetails: () => void;
  aggregatedStatistics: (params: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter']) => void;
};

type ressourceFiltersType = {
  aggregatedStatistics: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter'];
};

function AdminInfosDataFetcher(props: {
  children: (fetched: {
    adminInfos: adminInfosType;
    refetch: refetchInfosType;
    ressourceFilters: ressourceFiltersType;
  }) => ReactElement;
}) {
  return (
    <AgentsDataFetcher>
      {({ usersWithDetails }) => (
        <TreatedDocumentsDataFetcher>
          {({ treatedDocuments }) => (
            <UntreatedDocumentsDataFetcher>
              {({ untreatedDocuments, refetch: refetchUntreatedDocuments }) => (
                <StatisticsDataFetcher>
                  {({
                    aggregatedStatistics,
                    refetch: refetchAggregatedStatistics,
                    ressourceFilter: ressourceFilterAggregatedStatistics,
                  }) => (
                    <ProblemReportsDataFetcher>
                      {({ problemReportsWithDetails, refetch: refetchProblemReportsWithDetails }) =>
                        props.children({
                          adminInfos: {
                            aggregatedStatistics,
                            problemReportsWithDetails,
                            treatedDocuments,
                            usersWithDetails,
                            untreatedDocuments,
                          },
                          refetch: {
                            aggregatedStatistics: refetchAggregatedStatistics,
                            problemReportsWithDetails: refetchProblemReportsWithDetails,
                            untreatedDocuments: refetchUntreatedDocuments,
                          },
                          ressourceFilters: {
                            aggregatedStatistics: ressourceFilterAggregatedStatistics,
                          },
                        })
                      }
                    </ProblemReportsDataFetcher>
                  )}
                </StatisticsDataFetcher>
              )}
            </UntreatedDocumentsDataFetcher>
          )}
        </TreatedDocumentsDataFetcher>
      )}
    </AgentsDataFetcher>
  );
}
