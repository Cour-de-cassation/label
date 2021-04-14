import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { AgentsDataFetcher } from './Agents/AgentsDataFetcher';
import { ProblemReportsDataFetcher } from './ProblemReports/ProblemReportsDataFetcher';
import { TreatedDocumentsDataFetcher } from './TreatedDocuments/TreatedDocumentsDataFetcher';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocuments/UntreatedDocumentsDataFetcher';
import { StatisticsDataFetcher } from './Statistics/StatisticsDataFetcher';

export { AdminInfosDataFetcher };

type adminInfosType = {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  statistics: apiRouteOutType<'get', 'statistics'>;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
  usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>;
};

type refetchInfosType = {
  problemReportsWithDetails: () => void;
};

function AdminInfosDataFetcher(props: {
  children: (fetched: { adminInfos: adminInfosType; refetch: refetchInfosType }) => ReactElement;
}) {
  return (
    <AgentsDataFetcher>
      {({ usersWithDetails }) => (
        <TreatedDocumentsDataFetcher>
          {({ treatedDocuments }) => (
            <UntreatedDocumentsDataFetcher>
              {({ untreatedDocuments }) => (
                <StatisticsDataFetcher>
                  {({ statistics }) => (
                    <ProblemReportsDataFetcher>
                      {({ problemReportsWithDetails, refetch: refetchProblemReportsWithDetails }) =>
                        props.children({
                          adminInfos: {
                            problemReportsWithDetails,
                            statistics,
                            treatedDocuments,
                            usersWithDetails,
                            untreatedDocuments,
                          },
                          refetch: {
                            problemReportsWithDetails: refetchProblemReportsWithDetails,
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
