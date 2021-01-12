import React, { ReactElement } from 'react';
import { idModule, problemReportType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { ProblemReportsDataFetcher };

function ProblemReportsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { problemReports: problemReportType[] }) => ReactElement;
}) {
  const problemReportsFetchInfo = useApi(() => apiCaller.get<'problemReports'>('problemReports'));

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(problemReports: problemReportType[]) => props.children({ problemReports })}
      fetchInfo={problemReportsFetchInfo}
      dataAdapter={(problemReports) =>
        problemReports.map((problemReport) => ({
          ...problemReport,
          _id: idModule.lib.buildId(problemReport._id),
          assignationId: idModule.lib.buildId(problemReport.assignationId),
        }))
      }
    />
  );
}
