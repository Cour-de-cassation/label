import React, { ReactElement } from 'react';
import { idModule, problemReportType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { ProblemReportsDataFetcher };

export type { problemReportWithDetailsType };

type problemReportWithDetailsType = {
  problemReport: problemReportType;
  email: string;
};

function ProblemReportsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { problemReportsWithDetails: problemReportWithDetailsType[] }) => ReactElement;
}) {
  const problemReportsFetchInfo = useApi(buildFetchProblemReports());

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(problemReportsWithDetails: problemReportWithDetailsType[]) =>
        props.children({ problemReportsWithDetails })
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
      data: problemReportsWithDetails.map(({ problemReport, email }) => ({
        problemReport: {
          ...problemReport,
          _id: idModule.lib.buildId(problemReport._id),
          assignationId: idModule.lib.buildId(problemReport.assignationId),
        },
        email,
      })),
      statusCode,
    };
  };
}
