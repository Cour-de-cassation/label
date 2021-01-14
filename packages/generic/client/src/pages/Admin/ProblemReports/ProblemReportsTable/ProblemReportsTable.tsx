import React from 'react';
import { problemReportType } from '@label/core';
import { Table, Text } from '../../../../components';
import { wordings } from '../../../../wordings';

export { ProblemReportsTable };

type formattedProblemReportType = {
  _id: string;
  type: string;
  text: string;
};

function ProblemReportsTable(props: { problemReports: problemReportType[] }) {
  const formattedProblemReports = formatProblemReports(props.problemReports);
  return (
    <Table
      isHeaderSticky
      data={formattedProblemReports}
      header={[
        {
          id: '_id',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.number}</Text>,
          canBeSorted: true,
        },
        {
          id: 'type',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.type}</Text>,
          canBeSorted: true,
        },
        {
          id: 'text',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.text}</Text>,
          canBeSorted: true,
        },
      ]}
    />
  );
}

function formatProblemReports(problemReports: problemReportType[]): formattedProblemReportType[] {
  return problemReports.map((problemReport) => ({
    _id: `${problemReport._id}`,
    type: problemReport.type,
    text: problemReport.text,
  }));
}
