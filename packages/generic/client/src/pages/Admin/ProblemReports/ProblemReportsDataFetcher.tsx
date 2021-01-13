import React, { ReactElement } from 'react';
import { idModule, problemReportType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { ProblemReportsDataFetcher };

function ProblemReportsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { problemReports: problemReportType[] }) => ReactElement;
}) {
  const problemReportsFetchInfo = useApi(buildFetchProblemReports());

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(problemReports: problemReportType[]) => props.children({ problemReports })}
      fetchInfo={problemReportsFetchInfo}
    />
  );
}

function buildFetchProblemReports() {
  return async () => {
    const { data: problemReports, statusCode } = await apiCaller.get<'problemReports'>('problemReports');

    return {
      data: problemReports.map((problemReport) => ({
        ...problemReport,
        _id: idModule.lib.buildId(problemReport._id),
        assignationId: idModule.lib.buildId(problemReport.assignationId),
      })),
      statusCode,
    };
  };
}
