import React from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller } from '../../../../api';
import { ProblemReportIcon, Table, Text } from '../../../../components';
import { timeOperator } from '../../../../services/timeOperator';
import { wordings } from '../../../../wordings';

export { ProblemReportsTable };

const PROBLEM_REPORT_ICON_SIZE = 24;

function ProblemReportsTable(props: {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
}) {
  const optionItems = buildOptionItems();
  return (
    <Table
      isHeaderSticky
      data={props.problemReportsWithDetails}
      dataFormatter={problemReportFormatter}
      header={[
        {
          id: '_id',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.number}</Text>,
          canBeSorted: true,
        },
        {
          id: 'userName',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.agent}</Text>,
          canBeSorted: true,
        },
        {
          id: 'type',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.type}</Text>,
          canBeSorted: true,
        },
        {
          id: 'date',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.date}</Text>,
          canBeSorted: true,
        },
        {
          id: 'text',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.text}</Text>,
          canBeSorted: true,
        },
      ]}
      optionItems={optionItems}
    />
  );
}

function buildOptionItems() {
  return [
    {
      text: wordings.problemReportsPage.table.optionItems.reinjectIntoStream,
      onClick: (problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) => {
        apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
          assignationId: idModule.lib.buildId(problemReportWithDetails.problemReport.assignationId),
          status: 'free',
        });
      },
    },
    {
      text: wordings.problemReportsPage.table.optionItems.reassignToAgent,
      onClick: (problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) => {
        apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
          assignationId: idModule.lib.buildId(problemReportWithDetails.problemReport.assignationId),
          status: 'pending',
        });
      },
    },
  ];
}

function problemReportFormatter(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
  return {
    _id: idModule.lib.convertToString(problemReportWithDetails.problemReport._id),
    userName: problemReportWithDetails.userName,
    type: <ProblemReportIcon type={problemReportWithDetails.problemReport.type} iconSize={PROBLEM_REPORT_ICON_SIZE} />,
    date: timeOperator.convertTimestampToReadableDate(problemReportWithDetails.problemReport.date),
    text: problemReportWithDetails.problemReport.text,
  };
}
