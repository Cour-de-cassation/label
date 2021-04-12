import React from 'react';
import { useHistory } from 'react-router-dom';
import format from 'string-template';
import { apiRouteOutType, timeOperator } from '@label/core';
import { apiCaller } from '../../../../api';
import { DocumentStatusIcon, ProblemReportIcon, Table, tableRowFieldType } from '../../../../components';
import { wordings } from '../../../../wordings';

export { ProblemReportsTable };

const TABLE_ICON_SIZE = 24;

function ProblemReportsTable(props: {
  refetch: () => void;
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
}) {
  const history = useHistory();
  const optionItems = buildOptionItems();
  return (
    <Table
      data={props.problemReportsWithDetails}
      isRowHighlighted={isRowHighlighted}
      fields={problemReportsFields}
      optionItems={optionItems}
      onRowClick={onRowClick}
    />
  );

  function openMailToAgent(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
    const subject = format(wordings.problemReportsPage.table.mailSubject, {
      documentNumber: problemReportWithDetails.document.documentNumber,
    });
    const email = problemReportWithDetails.user.email;
    const mailto = document.createElement('a');
    mailto.href = `mailto:${email}?subject=${subject}`;
    mailto.click();
  }

  function buildOptionItems() {
    return [
      {
        text: wordings.problemReportsPage.table.optionItems.answerByEmail,
        onClick: openMailToAgent,
        iconName: 'mail' as const,
      },
      {
        text: wordings.problemReportsPage.table.optionItems.deleteProblemReport,
        onClick: async (problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) => {
          await apiCaller.post<'deleteProblemReport'>('deleteProblemReport', {
            problemReportId: problemReportWithDetails.problemReport._id,
          });
          props.refetch();
        },
        iconName: 'delete' as const,
      },
      {
        text: wordings.problemReportsPage.table.optionItems.openDocument,
        onClick: (problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) => {
          history.push(`/admin/document/${problemReportWithDetails.document._id}`);
          return;
        },
        iconName: 'eye' as const,
      },
      {
        text: wordings.problemReportsPage.table.optionItems.reassignToAgent,
        onClick: async (problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) => {
          await apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
            assignationId: problemReportWithDetails.problemReport.assignationId,
            status: 'pending',
          });
          props.refetch();
        },
        iconName: 'turnRight' as const,
      },
      {
        text: wordings.problemReportsPage.table.optionItems.validate,
        onClick: async (problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) => {
          await apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
            assignationId: problemReportWithDetails.problemReport.assignationId,
            status: 'done',
          });
          props.refetch();
        },
        iconName: 'send' as const,
      },
    ];
  }

  async function onRowClick(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
    await apiCaller.post<'updateProblemReportHasBeenRead'>('updateProblemReportHasBeenRead', {
      hasBeenRead: !problemReportWithDetails.problemReport.hasBeenRead,
      problemReportId: problemReportWithDetails.problemReport._id,
    });
    props.refetch();
  }
}

function isRowHighlighted(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
  return !problemReportWithDetails.problemReport.hasBeenRead;
}

const problemReportsFields: Array<tableRowFieldType<apiRouteOutType<'get', 'problemReportsWithDetails'>[number]>> = [
  {
    id: 'documentNumber',
    title: wordings.problemReportsPage.table.columnTitles.number,
    canBeSorted: true,
    extractor: (problemReportWithDetails) => problemReportWithDetails.document.documentNumber,
    width: 2,
  },
  {
    id: 'userName',
    title: wordings.problemReportsPage.table.columnTitles.agent,
    canBeSorted: true,
    extractor: (problemReportWithDetails) => problemReportWithDetails.user.name,
    width: 3,
  },
  {
    id: 'type',
    canBeSorted: true,
    title: wordings.problemReportsPage.table.columnTitles.type,
    extractor: (problemReportWithDetails) => problemReportWithDetails.problemReport.type,
    render: (problemReportWithDetails) => (
      <ProblemReportIcon type={problemReportWithDetails.problemReport.type} iconSize={TABLE_ICON_SIZE} />
    ),
    width: 1,
  },
  {
    id: 'status',
    canBeSorted: true,
    title: wordings.problemReportsPage.table.columnTitles.status,
    extractor: (problemReportWithDetails) => problemReportWithDetails.document.status,
    render: (problemReportWithDetails) => (
      <DocumentStatusIcon status={problemReportWithDetails.document.status} iconSize={TABLE_ICON_SIZE} />
    ),
    width: 1,
  },
  {
    id: 'date',
    title: wordings.problemReportsPage.table.columnTitles.date,
    canBeSorted: true,
    extractor: (problemReportWithDetails) =>
      timeOperator.convertTimestampToReadableDate(problemReportWithDetails.problemReport.date, true),
    getSortingValue: (problemReportWithDetails) => problemReportWithDetails.problemReport.date,
    width: 4,
  },
  {
    id: 'text',
    canBeSorted: true,
    title: wordings.problemReportsPage.table.columnTitles.text,
    extractor: (problemReportWithDetails) => problemReportWithDetails.problemReport.text,
    width: 10,
  },
];
