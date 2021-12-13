import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { ProblemReportsDataFetcher };

function ProblemReportsDataFetcher(props: {
  children: (fetched: {
    problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
    refetch: () => void;
    isLoading: boolean;
  }) => ReactElement;
}) {
  const problemReportsFetchInfo = useApi(buildFetchProblemReports(), {});

  return (
    <DataFetcher
      buildComponentWithData={(problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>) =>
        props.children({
          problemReportsWithDetails,
          refetch: () => problemReportsFetchInfo.refetch({}),
          isLoading: !problemReportsFetchInfo.isLoaded,
        })
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
      data: problemReportsWithDetails.map((problemReportWithDetails) => ({
        ...problemReportWithDetails,
        document: {
          ...problemReportWithDetails.document,
          _id: idModule.lib.buildId(problemReportWithDetails.document._id),
        },
        problemReport: {
          ...problemReportWithDetails.problemReport,
          _id: idModule.lib.buildId(problemReportWithDetails.problemReport._id),
          documentId: idModule.lib.buildId(problemReportWithDetails.problemReport.documentId),
          userId: idModule.lib.buildId(problemReportWithDetails.problemReport.userId),
        },
      })),
      statusCode,
    };
  };
}
