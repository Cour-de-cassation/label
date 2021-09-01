import React, { ReactElement } from 'react';
import { apiRouteInType, apiRouteOutType } from '@label/core';
import { WorkingUsersDataFetcher } from './WorkingUsers/WorkingUsersDataFetcher';
import { ProblemReportsDataFetcher } from './ProblemReports/ProblemReportsDataFetcher';
import { TreatedDocumentsDataFetcher } from './TreatedDocuments/TreatedDocumentsDataFetcher';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocuments/UntreatedDocumentsDataFetcher';
import { StatisticsDataFetcher } from './Statistics/StatisticsDataFetcher';

export { AdminInfosDataFetcher };

type adminInfosType = {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
  workingUsers: apiRouteOutType<'get', 'workingUsers'>;
};

type refetchInfosType = {
  aggregatedStatistics: (params: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter']) => void;
  problemReportsWithDetails: () => void;
  treatedDocuments: () => void;
  untreatedDocuments: () => void;
  workingUsers: () => void;
};

type isLoadingInfosType = {
  aggregatedStatistics: boolean;
  treatedDocuments: boolean;
  untreatedDocuments: boolean;
  problemReports: boolean;
};

type ressourceFiltersType = {
  aggregatedStatistics: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter'];
};

function AdminInfosDataFetcher(props: {
  children: (fetched: {
    adminInfos: adminInfosType;
    refetch: refetchInfosType;
    isLoading: isLoadingInfosType;
    ressourceFilters: ressourceFiltersType;
  }) => ReactElement;
}) {
  return (
    <WorkingUsersDataFetcher>
      {({ workingUsers, refetch: refetchWorkingUsers }) => (
        <TreatedDocumentsDataFetcher>
          {({ treatedDocuments, refetch: refetchTreatedDocuments, isLoading: isLoadingTreatedDocuments }) => (
            <UntreatedDocumentsDataFetcher>
              {({ untreatedDocuments, refetch: refetchUntreatedDocuments, isLoading: isLoadingUntreatedDocuments }) => (
                <StatisticsDataFetcher>
                  {({
                    availableStatisticFilters,
                    aggregatedStatistics,
                    refetch: refetchAggregatedStatistics,
                    isLoading: isLoadingAggregatedStatistics,
                    ressourceFilter: ressourceFilterAggregatedStatistics,
                  }) => (
                    <ProblemReportsDataFetcher>
                      {({
                        problemReportsWithDetails,
                        refetch: refetchProblemReportsWithDetails,
                        isLoading: isLoadingProblemReports,
                      }) =>
                        props.children({
                          adminInfos: {
                            availableStatisticFilters,
                            aggregatedStatistics,
                            problemReportsWithDetails,
                            treatedDocuments,
                            workingUsers,
                            untreatedDocuments,
                          },
                          refetch: {
                            aggregatedStatistics: refetchAggregatedStatistics,
                            problemReportsWithDetails: refetchProblemReportsWithDetails,
                            treatedDocuments: refetchTreatedDocuments,
                            untreatedDocuments: refetchUntreatedDocuments,
                            workingUsers: refetchWorkingUsers,
                          },
                          isLoading: {
                            aggregatedStatistics: isLoadingAggregatedStatistics,
                            problemReports: isLoadingProblemReports,
                            treatedDocuments: isLoadingTreatedDocuments,
                            untreatedDocuments: isLoadingUntreatedDocuments,
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
    </WorkingUsersDataFetcher>
  );
}
