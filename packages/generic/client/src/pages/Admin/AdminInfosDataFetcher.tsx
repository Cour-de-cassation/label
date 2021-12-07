import React, { ReactElement } from 'react';
import { apiRouteInType, apiRouteOutType } from '@label/core';
import { WorkingUsersDataFetcher } from './WorkingUsers/WorkingUsersDataFetcher';
import { ProblemReportsDataFetcher } from './ProblemReports/ProblemReportsDataFetcher';
import { TreatedDocumentsDataFetcher } from './TreatedDocuments/TreatedDocumentsDataFetcher';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocuments/UntreatedDocumentsDataFetcher';
import { StatisticsDataFetcher } from './Statistics/StatisticsDataFetcher';
import { ToBeConfirmedDocumentsDataFetcher } from './ToBeConfirmedDocuments/ToBeConfirmedDocumentsDataFetcher';

export { AdminInfosDataFetcher };

type adminInfosType = {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
  toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
  workingUsers: apiRouteOutType<'get', 'workingUsers'>;
};

type refetchInfosType = {
  aggregatedStatistics: (params: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter']) => void;
  problemReportsWithDetails: () => void;
  toBeConfirmedDocuments: () => void;
  treatedDocuments: () => void;
  untreatedDocuments: () => void;
  workingUsers: () => void;
};

type isLoadingInfosType = {
  aggregatedStatistics: boolean;
  toBeConfirmedDocuments: boolean;
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
            <ToBeConfirmedDocumentsDataFetcher>
              {({
                isLoading: isLoadindToBeConfirmedDocuments,
                refetch: refetchToBeConfirmedDocuments,
                toBeConfirmedDocuments,
              }) => (
                <UntreatedDocumentsDataFetcher>
                  {({
                    untreatedDocuments,
                    refetch: refetchUntreatedDocuments,
                    isLoading: isLoadingUntreatedDocuments,
                  }) => (
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
                                toBeConfirmedDocuments,
                                treatedDocuments,
                                workingUsers,
                                untreatedDocuments,
                              },
                              refetch: {
                                aggregatedStatistics: refetchAggregatedStatistics,
                                problemReportsWithDetails: refetchProblemReportsWithDetails,
                                toBeConfirmedDocuments: refetchToBeConfirmedDocuments,
                                treatedDocuments: refetchTreatedDocuments,
                                untreatedDocuments: refetchUntreatedDocuments,
                                workingUsers: refetchWorkingUsers,
                              },
                              isLoading: {
                                aggregatedStatistics: isLoadingAggregatedStatistics,
                                problemReports: isLoadingProblemReports,
                                toBeConfirmedDocuments: isLoadindToBeConfirmedDocuments,
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
            </ToBeConfirmedDocumentsDataFetcher>
          )}
        </TreatedDocumentsDataFetcher>
      )}
    </WorkingUsersDataFetcher>
  );
}
