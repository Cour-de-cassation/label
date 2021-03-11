import React from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller } from '../../../../api';
import { ProblemReportIcon, Table, tableRowFieldType } from '../../../../components';
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
      fields={problemReportsFields}
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

const problemReportsFields: Array<tableRowFieldType<
  apiRouteOutType<'get', 'problemReportsWithDetails'>[number],
  string | number | JSX.Element
>> = [
  {
    id: '_id',
    title: wordings.problemReportsPage.table.columnTitles.number,
    canBeSorted: true,
    extractor: (problemReportWithDetails) => idModule.lib.convertToString(problemReportWithDetails.problemReport._id),
    width: 4,
  },
  {
    id: 'userName',
    title: wordings.problemReportsPage.table.columnTitles.agent,
    canBeSorted: true,
    extractor: (problemReportWithDetails) => problemReportWithDetails.userName,
    width: 6,
  },
  {
    id: 'type',
    canBeSorted: true,
    title: wordings.problemReportsPage.table.columnTitles.type,
    extractor: (problemReportWithDetails) => (
      <ProblemReportIcon type={problemReportWithDetails.problemReport.type} iconSize={PROBLEM_REPORT_ICON_SIZE} />
    ),
    width: 1,
  },
  {
    id: 'date',
    title: wordings.problemReportsPage.table.columnTitles.date,
    canBeSorted: true,
    extractor: (problemReportWithDetails) =>
      timeOperator.convertTimestampToReadableDate(problemReportWithDetails.problemReport.date, true),
    width: 5,
  },
  {
    id: 'text',
    canBeSorted: true,
    title: wordings.problemReportsPage.table.columnTitles.text,
    extractor: (problemReportWithDetails) => problemReportWithDetails.problemReport.text,
    width: 10,
  },
];
