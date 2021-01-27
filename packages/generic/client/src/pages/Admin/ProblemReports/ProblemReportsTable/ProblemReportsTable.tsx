import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller } from '../../../../api';
import { ProblemReportIcon, Table, Text } from '../../../../components';
import { wordings } from '../../../../wordings';

export { ProblemReportsTable };

type formattedProblemReportType = {
  _id: string;
  userName: string;
  type: ReactElement;
  text: string;
};

const PROBLEM_REPORT_ICON_SIZE = 24;

function ProblemReportsTable(props: {
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
}) {
  const formattedProblemReports = formatProblemReportsWithDetails(props.problemReportsWithDetails);
  const optionItems = buildOptionItems(props.problemReportsWithDetails);

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
          id: 'text',
          content: <Text variant="h3">{wordings.problemReportsPage.table.columnTitles.text}</Text>,
          canBeSorted: true,
        },
      ]}
      optionItems={optionItems}
    />
  );
}

function buildOptionItems(problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>) {
  return [
    {
      text: wordings.problemReportsPage.table.optionItems.reinjectIntoStream,
      onClick: (problemReportId: string) => {
        const problemReportWithDetails = problemReportsWithDetails.find(({ problemReport }) =>
          idModule.lib.equalId(problemReport._id, idModule.lib.buildId(problemReportId)),
        );
        if (!problemReportWithDetails) {
          return;
        }
        apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
          assignationId: idModule.lib.buildId(problemReportWithDetails.problemReport.assignationId),
          status: 'free',
        });
      },
    },
    {
      text: wordings.problemReportsPage.table.optionItems.reassignToAgent,
      onClick: (problemReportId: string) => {
        const problemReportWithDetails = problemReportsWithDetails.find(({ problemReport }) =>
          idModule.lib.equalId(problemReport._id, idModule.lib.buildId(problemReportId)),
        );
        if (!problemReportWithDetails) {
          return;
        }
        apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
          assignationId: idModule.lib.buildId(problemReportWithDetails.problemReport.assignationId),
          status: 'pending',
        });
      },
    },
  ];
}

function formatProblemReportsWithDetails(
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>,
): formattedProblemReportType[] {
  return problemReportsWithDetails.map(({ problemReport, userName }) => ({
    _id: idModule.lib.convertToString(problemReport._id),
    userName,
    type: <ProblemReportIcon type={problemReport.type} iconSize={PROBLEM_REPORT_ICON_SIZE} />,
    text: problemReport.text,
  }));
}
