import React, { ReactElement } from 'react';
import { apiRouteInType, apiRouteOutType } from '@label/core';
import { WorkingUsersDataFetcher } from './WorkingUsers/WorkingUsersDataFetcher';
import { ProblemReportsDataFetcher } from './ProblemReports/ProblemReportsDataFetcher';
import { TreatedDocumentsDataFetcher } from './TreatedDocuments/TreatedDocumentsDataFetcher';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocuments/UntreatedDocumentsDataFetcher';
import { StatisticsDataFetcher } from './Statistics/StatisticsDataFetcher';
import { SummaryDataFetcher } from './Summary/SummaryDataFetcher';
import { ToBeConfirmedDocumentsDataFetcher } from './ToBeConfirmedDocuments/ToBeConfirmedDocumentsDataFetcher';
import { PreAssignDocumentsDataFetcher } from './PreAssignDocuments/PreAssignDocumentsDataFetcher';

export { AdminInfosDataFetcher };

type adminInfosType = {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  availableStatisticFilters: apiRouteOutType<'get', 'availableStatisticFilters'>;
  aggregatedStatistics: apiRouteOutType<'get', 'aggregatedStatistics'>;
  summary: apiRouteOutType<'get', 'summary'>;
  toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
  workingUsers: apiRouteOutType<'get', 'workingUsers'>;
  preAssignations: apiRouteOutType<'get', 'preAssignations'>;
};

type refetchInfosType = {
  aggregatedStatistics: (params: apiRouteInType<'get', 'aggregatedStatistics'>['ressourceFilter']) => void;
  problemReportsWithDetails: () => void;
  summary: () => void;
  toBeConfirmedDocuments: () => void;
  treatedDocuments: () => void;
  untreatedDocuments: () => void;
  workingUsers: () => void;
  preAssignDocuments: () => void;
};

type isLoadingInfosType = {
  aggregatedStatistics: boolean;
  summary: boolean;
  toBeConfirmedDocuments: boolean;
  treatedDocuments: boolean;
  untreatedDocuments: boolean;
  problemReports: boolean;
  preAssignDocuments: boolean;
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
                        <PreAssignDocumentsDataFetcher>
                          {({preAssignations, isLoading:isLoadingPreAssignDocuments, refetch:refetchPreAssignDocuments})=>(
                        <SummaryDataFetcher>
                          {({ summary, refetch: refetchSummary, isLoading: isLoadingSummary }) => (
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
                                    summary,
                                    toBeConfirmedDocuments,
                                    treatedDocuments,
                                    workingUsers,
                                    untreatedDocuments,
                                    preAssignations
                                  },
                                  refetch: {
                                    aggregatedStatistics: refetchAggregatedStatistics,
                                    problemReportsWithDetails: refetchProblemReportsWithDetails,
                                    summary: refetchSummary,
                                    toBeConfirmedDocuments: refetchToBeConfirmedDocuments,
                                    treatedDocuments: refetchTreatedDocuments,
                                    untreatedDocuments: refetchUntreatedDocuments,
                                    workingUsers: refetchWorkingUsers,
                                    preAssignDocuments:refetchPreAssignDocuments,
                                  },
                                  isLoading: {
                                    aggregatedStatistics: isLoadingAggregatedStatistics,
                                    summary: isLoadingSummary,
                                    problemReports: isLoadingProblemReports,
                                    toBeConfirmedDocuments: isLoadindToBeConfirmedDocuments,
                                    treatedDocuments: isLoadingTreatedDocuments,
                                    untreatedDocuments: isLoadingUntreatedDocuments,
                                    preAssignDocuments: isLoadingPreAssignDocuments,
                                  },
                                  ressourceFilters: {
                                    aggregatedStatistics: ressourceFilterAggregatedStatistics,
                                  },
                                })
                              }
                            </ProblemReportsDataFetcher>
                          )}
                        </SummaryDataFetcher>
                        )}
                        </PreAssignDocumentsDataFetcher>
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
