import React from 'react';
import { problemReportWithDetailsType } from '../ProblemReportsDataFetcher';
import { Table, Text } from '../../../../components';
import { wordings } from '../../../../wordings';

export { ProblemReportsTable };

type formattedProblemReportType = {
  _id: string;
  email: string;
  type: string;
  text: string;
};

function ProblemReportsTable(props: { problemReportsWithDetails: problemReportWithDetailsType[] }) {
  const formattedProblemReports = formatProblemReportsWithDetails(props.problemReportsWithDetails);
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
          id: 'email',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.agent}</Text>,
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

function formatProblemReportsWithDetails(
  problemReportsWithDetails: problemReportWithDetailsType[],
): formattedProblemReportType[] {
  return problemReportsWithDetails.map(({ problemReport, email }) => ({
    _id: `${problemReport._id}`,
    email,
    type: problemReport.type,
    text: problemReport.text,
  }));
}
