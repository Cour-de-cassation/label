import React, { ReactElement } from 'react';
import { problemReportType } from '@label/core';
import { useGraphQLQuery } from '../../../graphQL';
import { DataFetcher } from '../../DataFetcher';

export { ProblemReportsDataFetcher };

type problemReportsGraphQLType = {
  problemReports: problemReportType[];
};

function ProblemReportsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: { problemReports: problemReportType[] }) => ReactElement;
}) {
  const problemReportsFetchInfo = useGraphQLQuery<'problemReports'>('problemReports');
  const problemReportsDataAdapter = ([data]: [problemReportsGraphQLType]) => [data.problemReports];

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={([problemReports]) => props.children({ problemReports })}
      fetchInfos={[problemReportsFetchInfo]}
      dataAdapter={problemReportsDataAdapter}
    />
  );
}
