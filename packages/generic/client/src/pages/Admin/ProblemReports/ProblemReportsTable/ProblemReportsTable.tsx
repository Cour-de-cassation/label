import React from 'react';
import { useHistory } from 'react-router-dom';
import format from 'string-template';
import { apiRouteOutType, documentModule, idModule, timeOperator } from '@label/core';
import { apiCaller } from '../../../../api';
import { DocumentStatusIcon, ProblemReportIcon, Table, tableRowFieldType } from '../../../../components';
import { sendMail } from '../../../../services/sendMail';
import { wordings } from '../../../../wordings';
import { routes } from '../../../routes';

export { ProblemReportsTable };

const TABLE_ICON_SIZE = 24;

function ProblemReportsTable(props: {
  refetch: () => void;
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
}) {
  const history = useHistory();
  return (
    <Table
      data={props.problemReportsWithDetails}
      isRowHighlighted={isRowHighlighted}
      fields={problemReportsFields}
      buildOptionItems={buildOptionItems}
      onRowClick={onRowClick}
      defaultOrderByProperty="date"
      defaultOrderDirection="desc"
    />
  );

  function buildOptionItems(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
    const validateDocumentOptionItem =
      problemReportWithDetails.document.status !== 'done'
        ? {
            text: wordings.problemReportsPage.table.optionItems.validate,
            onClick: async () => {
              await apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
                assignationId: problemReportWithDetails.problemReport.assignationId,
                status: documentModule.lib.getNextStatus({
                  status: problemReportWithDetails.document.status,
                  publicationCategory: problemReportWithDetails.document.publicationCategory,
                }),
              });
              props.refetch();
            },
            iconName: 'send' as const,
          }
        : undefined;

    const answerByEmailOptionItem = {
      text: wordings.problemReportsPage.table.optionItems.answerByEmail,
      onClick: () => {
        const subject = format(wordings.problemReportsPage.table.mailSubject, {
          documentNumber: problemReportWithDetails.document.documentNumber,
        });
        const email = problemReportWithDetails.user.email;
        const body = problemReportWithDetails.problemReport.text;
        sendMail({ email, subject, body });
      },
      iconName: 'mail' as const,
    };

    const deleteProblemReportOptionItem = {
      text: wordings.problemReportsPage.table.optionItems.deleteProblemReport,
      onClick: async () => {
        await apiCaller.post<'deleteProblemReport'>('deleteProblemReport', {
          problemReportId: problemReportWithDetails.problemReport._id,
        });
        props.refetch();
      },
      iconName: 'delete' as const,
    };

    const openDocumentOptionItem = {
      text: wordings.problemReportsPage.table.optionItems.openDocument,
      onClick: () => {
        history.push(routes.DOCUMENT.getPath(idModule.lib.convertToString(problemReportWithDetails.document._id)));
        return;
      },
      iconName: 'find' as const,
    };

    const reassignToAgentOptionItem = {
      text: wordings.problemReportsPage.table.optionItems.reassignToAgent,
      onClick: async () => {
        await apiCaller.post<'updateAssignationDocumentStatus'>('updateAssignationDocumentStatus', {
          assignationId: problemReportWithDetails.problemReport.assignationId,
          status: documentModule.lib.getNextStatus({
            status: 'pending',
            publicationCategory: problemReportWithDetails.document.publicationCategory,
          }),
        });
        props.refetch();
      },
      iconName: 'turnRight' as const,
    };
    const optionItems = [
      answerByEmailOptionItem,
      deleteProblemReportOptionItem,
      openDocumentOptionItem,
      reassignToAgentOptionItem,
    ];
    if (validateDocumentOptionItem) {
      return [...optionItems, validateDocumentOptionItem];
    }
    return optionItems;
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
