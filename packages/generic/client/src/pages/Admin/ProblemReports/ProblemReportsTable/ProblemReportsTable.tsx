import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import format from 'string-template';
import { optionItemType, Table, tableRowFieldType } from 'pelta-design-system';
import { apiRouteOutType, documentModule, idModule, timeOperator } from '@label/core';
import { apiCaller } from '../../../../api';
import { DocumentStatusIcon, ProblemReportIcon } from '../../../../components';
import { useAlert } from '../../../../services/alert';
import { usePopup } from '../../../../services/popup';
import { localStorage } from '../../../../services/localStorage';
import { sendMail } from '../../../../services/sendMail';
import { wordings } from '../../../../wordings';
import { routes } from '../../../routes';
import { useCtxUser } from '../../../../contexts/user.context';
import { annotationDiffDocumentInfoType, AnnotationsDiffDrawer } from '../../TreatedDocuments/AnnotationsDiffDrawer';

export { ProblemReportsTable };

const TABLE_ICON_SIZE = 24;

const PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH = 400;

function ProblemReportsTable(props: {
  refetch: () => void;
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
}) {
  const history = useHistory();
  const { displayAlert } = useAlert();
  const { displayPopup } = usePopup();
  const [annotationDiffDocumentInfo, setAnnotationDiffDocumentInfo] = useState<
    annotationDiffDocumentInfoType | undefined
  >();

  const problemReportsFields = buildProblemReportsFields();

  const { user, loading } = useCtxUser();
  if (loading) {
    return <div>Loading...</div>;
  }
  const userRole = user?.role;
  const adminView = localStorage.adminViewHandler.get();

  return (
    <>
      <AnnotationsDiffDrawer documentInfo={annotationDiffDocumentInfo} close={resetDrawer} />
      <Table
        data={props.problemReportsWithDetails}
        isRowHighlighted={isRowHighlighted}
        fields={problemReportsFields}
        buildOptionItems={buildOptionItems}
        onRowClick={userRole === 'admin' && adminView === 'admin' ? onRowClick : undefined}
        defaultOrderByProperty="date"
        defaultOrderDirection="desc"
      />
    </>
  );

  function buildProblemReportsFields(): Array<
    tableRowFieldType<apiRouteOutType<'get', 'problemReportsWithDetails'>[number]>
  > {
    return [
      {
        id: 'documentNumber',
        title: wordings.business.filters.columnTitles.documentNumber,
        canBeSorted: true,
        extractor: (problemReportWithDetails) => problemReportWithDetails.document?.documentNumber ?? '',
        width: 2,
      },
      {
        id: 'source',
        title: wordings.business.filters.columnTitles.source.title,
        tooltipText: wordings.business.filters.columnTitles.source.tooltipText,
        canBeSorted: true,
        extractor: (problemReportWithDetails) => problemReportWithDetails.document?.source ?? '',
        width: 2,
      },
      {
        id: 'jurisdiction',
        title: wordings.business.filters.columnTitles.jurisdiction.title,
        tooltipText: wordings.business.filters.columnTitles.jurisdiction.tooltipText,
        canBeSorted: true,
        extractor: (problemReportWithDetails) => problemReportWithDetails.document?.jurisdiction ?? '',
        width: 4,
      },
      {
        id: 'appealNumber',
        title: wordings.business.filters.columnTitles.appealNumber,
        canBeSorted: true,
        extractor: (problemReportWithDetails) => problemReportWithDetails.document?.appealNumber ?? '',
        width: 3,
      },
      {
        id: 'userName',
        title: wordings.business.filters.columnTitles.workingUser.title,
        tooltipText: wordings.business.filters.columnTitles.workingUser.tooltipText,
        canBeSorted: true,
        extractor: (problemReportWithDetails) => problemReportWithDetails.user.name,
        width: 3,
      },
      {
        id: 'type',
        canBeSorted: true,
        title: wordings.business.filters.columnTitles.problemReportType,
        extractor: (problemReportWithDetails) => problemReportWithDetails.problemReport.type,
        render: (problemReportWithDetails) => (
          <ProblemReportIcon type={problemReportWithDetails.problemReport.type} iconSize={TABLE_ICON_SIZE} />
        ),
        width: 1,
      },
      {
        id: 'status',
        canBeSorted: true,
        title: wordings.business.filters.columnTitles.status,
        extractor: (problemReportWithDetails) => problemReportWithDetails.document?.status ?? 'locked',
        render: (problemReportWithDetails) => (
          <DocumentStatusIcon
            status={problemReportWithDetails.document?.status ?? 'locked'}
            iconSize={TABLE_ICON_SIZE}
          />
        ),
        width: 1,
      },
      {
        id: 'date',
        title: wordings.business.filters.columnTitles.problemReportDate,
        canBeSorted: true,
        extractor: (problemReportWithDetails) =>
          timeOperator.convertTimestampToReadableDate(problemReportWithDetails.problemReport.date, true),
        getSortingValue: (problemReportWithDetails) => problemReportWithDetails.problemReport.date,
        width: 4,
      },
      {
        id: 'text',
        canBeSorted: true,
        title: wordings.business.filters.columnTitles.problemReportText,
        extractor: (problemReportWithDetails) => problemReportWithDetails.problemReport.text,
        width: 10,
        cellStyle: { maxWidth: `${PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH}px`, overflow: 'hidden' },
      },
    ];
  }

  function buildOptionItems(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
    const userRole = user?.role;

    const validateDocumentOptionItem = {
      kind: 'text' as const,
      text: wordings.problemReportsPage.table.optionItems.validate,
      onClick: async () => {
        try {
          await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
            documentId: problemReportWithDetails.problemReport.documentId,
            status: documentModule.lib.getNextStatus({
              status: problemReportWithDetails.document?.status ?? 'locked',
              publicationCategory: problemReportWithDetails.document?.publicationCategory ?? [],
              route: problemReportWithDetails.document?.route ?? 'default',
            }),
          });
        } catch (error) {
          displayAlert({ text: wordings.business.errors.updateDocumentStatusFailed, variant: 'alert', autoHide: true });
          console.warn(error);
          return;
        }
        props.refetch();
      },
      iconName: 'send' as const,
      isDisabled:
        userRole !== 'admin' ||
        problemReportWithDetails.document?.status === 'done' ||
        problemReportWithDetails.document?.status === 'toBePublished',
    };

    const answerByEmailOptionItem = {
      kind: 'text' as const,
      text: wordings.problemReportsPage.table.optionItems.answerByEmail,
      onClick: () => {
        const subject = format(wordings.problemReportsPage.table.mailSubject, {
          documentNumber: problemReportWithDetails.document?.documentNumber,
        });
        const email = problemReportWithDetails.user.email;
        const body = problemReportWithDetails.problemReport.text;
        sendMail({ email, subject, body });
      },
      iconName: 'mail' as const,
    };

    const deleteDocument = {
      kind: 'text' as const,
      text: wordings.problemReportsPage.table.optionItems.deleteDocument,
      onClick: async () => {
        try {
          displayPopup({
            text: wordings.problemReportsPage.table.popupConfirmMessage,
            onCancel: () => {},
            onConfirm: () => {
              problemReportWithDetails.document &&
                apiCaller.post<'deleteDocument'>('deleteDocument', {
                  documentId: problemReportWithDetails.document._id,
                });
              props.refetch();
            },
          });
        } catch (error) {
          displayAlert({ text: wordings.business.errors.deleteDocumentFailed, variant: 'alert', autoHide: true });
          console.warn(error);
          return;
        }
      },
      iconName: 'deleteOutline' as const,
      isDisabled: userRole !== 'admin' || adminView !== 'admin' || !problemReportWithDetails.document,
    };

    const deleteProblemReportOptionItem = {
      kind: 'text' as const,
      text: wordings.problemReportsPage.table.optionItems.deleteProblemReport,
      onClick: async () => {
        try {
          await apiCaller.post<'deleteProblemReport'>('deleteProblemReport', {
            problemReportId: problemReportWithDetails.problemReport._id,
          });
        } catch (error) {
          displayAlert({ text: wordings.business.errors.deleteProblemReportFailed, variant: 'alert', autoHide: true });
          console.warn(error);
          return;
        }
        props.refetch();
      },
      iconName: 'delete' as const,
      isDisabled:
        userRole !== 'admin' || adminView !== 'admin' || problemReportWithDetails.document?.status === 'locked',
    };

    const openDocumentOptionItem = {
      kind: 'text' as const,
      text: wordings.problemReportsPage.table.optionItems.openDocument,
      onClick: () => {
        problemReportWithDetails.document &&
          history.push(routes.DOCUMENT.getPath(idModule.lib.convertToString(problemReportWithDetails.document._id)));
        return;
      },
      iconName: 'find' as const,
    };

    const reassignToWorkingUserOptionItem = {
      kind: 'text' as const,
      text: wordings.problemReportsPage.table.optionItems.reassignToWorkingUser,
      onClick: async () => {
        try {
          await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
            documentId: problemReportWithDetails.problemReport.documentId,
            status: documentModule.lib.getNextStatus({
              status: 'pending',
              publicationCategory: problemReportWithDetails.document?.publicationCategory ?? [],
              route: problemReportWithDetails.document?.route ?? 'default',
            }),
          });
        } catch (error) {
          displayAlert({ text: wordings.business.errors.updateDocumentStatusFailed, variant: 'alert', autoHide: true });
          console.warn(error);
          return;
        }

        if (problemReportWithDetails.document?.route == 'simple') {
          try {
            await apiCaller.post<'updateDocumentRoute'>('updateDocumentRoute', {
              documentId: problemReportWithDetails.problemReport.documentId,
              route: 'exhaustive',
            });
          } catch (error) {
            displayAlert({
              text: wordings.business.errors.updateDocumentRouteFailded,
              variant: 'alert',
              autoHide: true,
            });
            console.warn(error);
            return;
          }
        }

        props.refetch();
      },
      isDisabled: userRole !== 'admin' || adminView !== 'admin',
      iconName: 'turnRight' as const,
    };

    const displayAnnotationDiff = {
      kind: 'text' as const,
      text: wordings.treatedDocumentsPage.table.optionItems.displayAnnotationDiff,
      onClick: () =>
        problemReportWithDetails.document &&
        setAnnotationDiffDocumentInfo({
          _id: problemReportWithDetails.document?._id,
          documentNumber: problemReportWithDetails.document?.documentNumber,
          userName: problemReportWithDetails.user.name,
        }),
      iconName: 'link' as const,
      isDisabled: !problemReportWithDetails.document,
    };

    const optionItems: Array<optionItemType> = [
      answerByEmailOptionItem,
      openDocumentOptionItem,
      reassignToWorkingUserOptionItem,
      validateDocumentOptionItem,
      deleteProblemReportOptionItem,
      deleteDocument,
      displayAnnotationDiff,
    ];

    return optionItems;
  }

  async function onRowClick(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
    try {
      await apiCaller.post<'updateProblemReportHasBeenRead'>('updateProblemReportHasBeenRead', {
        hasBeenRead: !problemReportWithDetails.problemReport.hasBeenRead,
        problemReportId: problemReportWithDetails.problemReport._id,
      });
    } catch (error) {
      displayAlert({
        text: wordings.business.errors.updateProblemReportHasBeenReadFailed,
        variant: 'alert',
        autoHide: true,
      });
      console.warn(error);
      return;
    }
    props.refetch();
  }

  function resetDrawer() {
    setAnnotationDiffDocumentInfo(undefined);
  }
}

function isRowHighlighted(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
  return !problemReportWithDetails.problemReport.hasBeenRead;
}
