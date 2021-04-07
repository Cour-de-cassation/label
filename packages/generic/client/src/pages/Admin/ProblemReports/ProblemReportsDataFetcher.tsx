import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { ProblemReportsDataFetcher };

function ProblemReportsDataFetcher(props: {
  children: (fetched: {
    problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
    refetch: () => void;
  }) => ReactElement;
}) {
  const problemReportsFetchInfo = useApi(buildFetchProblemReports());

  return (
    <DataFetcher
      buildComponentWithData={(problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>) =>
        props.children({ problemReportsWithDetails, refetch: problemReportsFetchInfo.refetch })
      }
      fetchInfo={problemReportsFetchInfo}
    />
  );
}

function buildFetchProblemReports() {
  return async () => {
    const { data: problemReportsWithDetails, statusCode } = await apiCaller.get<'problemReportsWithDetails'>(
      'problemReportsWithDetails',
    );
    return {
      data: problemReportsWithDetails.map(({ problemReport, userName, documentId }) => ({
        problemReport: {
          ...problemReport,
          _id: idModule.lib.buildId(problemReport._id),
          assignationId: idModule.lib.buildId(problemReport.assignationId),
        },
        userName,
        documentId: idModule.lib.buildId(documentId),
      })),
      statusCode,
    };
  };
}
