import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { AgentsDataFetcher } from './Agents/AgentsDataFetcher';
import { ProblemReportsDataFetcher } from './ProblemReports/ProblemReportsDataFetcher';
import { TreatedDocumentsDataFetcher } from './TreatedDocuments/TreatedDocumentsDataFetcher';
import { UntreatedDocumentsDataFetcher } from './UntreatedDocuments/UntreatedDocumentsDataFetcher';

export { AdminInfosDataFetcher };

type adminInfosType = {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
  usersWithDetails: apiRouteOutType<'get', 'usersWithDetails'>;
};

function AdminInfosDataFetcher(props: { children: (fetched: { adminInfos: adminInfosType }) => ReactElement }) {
  return (
    <AgentsDataFetcher>
      {({ usersWithDetails }) => (
        <ProblemReportsDataFetcher>
          {({ problemReportsWithDetails }) => (
            <TreatedDocumentsDataFetcher>
              {({ treatedDocuments }) => (
                <UntreatedDocumentsDataFetcher>
                  {({ untreatedDocuments }) =>
                    props.children({
                      adminInfos: { problemReportsWithDetails, treatedDocuments, usersWithDetails, untreatedDocuments },
                    })
                  }
                </UntreatedDocumentsDataFetcher>
              )}
            </TreatedDocumentsDataFetcher>
          )}
        </ProblemReportsDataFetcher>
      )}
    </AgentsDataFetcher>
  );
}
