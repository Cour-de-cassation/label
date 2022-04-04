import React from 'react';
import { useHistory } from 'react-router-dom';
import format from 'string-template';
import { customThemeType, useCustomTheme, optionItemType, Table, tableRowFieldType } from 'pelta-design-system';
import { apiRouteOutType, documentModule, idModule, timeOperator } from '@label/core';
import { apiCaller } from '../../../../api';
import { DocumentStatusIcon, ProblemReportIcon, PublicationCategoryBadge } from '../../../../components';
import { useAlert } from '../../../../services/alert';
import { localStorage } from '../../../../services/localStorage';
import { sendMail } from '../../../../services/sendMail';
import { wordings } from '../../../../wordings';
import { routes } from '../../../routes';

export { ProblemReportsTable };

const TABLE_ICON_SIZE = 24;

const PROBLEM_REPORT_TEXT_CELL_MAX_WIDTH = 400;

function ProblemReportsTable(props: {
  refetch: () => void;
  problemReportsWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>;
}) {
  const history = useHistory();
  const theme = useCustomTheme();
  const { displayAlert } = useAlert();

  const styles = buildStyles(theme);
  const problemReportsFields = buildProblemReportsFields();
  const userRole = localStorage.userHandler.getRole();

  return (
    <Table
      data={props.problemReportsWithDetails}
      isRowHighlighted={isRowHighlighted}
      fields={problemReportsFields}
      buildOptionItems={buildOptionItems}
      onRowClick={userRole === 'admin' ? onRowClick : undefined}
      defaultOrderByProperty="date"
      defaultOrderDirection="desc"
    />
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
        id: 'publicationCategory',
        title: wordings.business.filters.columnTitles.publicationCategory.title,
        tooltipText: wordings.business.filters.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        getSortingValue: (problemReport) => problemReport.document?.publicationCategory.length ?? 0,
        extractor: (problemReport) => problemReport.document?.publicationCategory.join(',') ?? '',
        render: (problemReport) =>
          problemReport.document && problemReport.document.publicationCategory.length > 0 ? (
            <div style={styles.publicationCategoryBadgesContainer}>
              {problemReport.document.publicationCategory.map((publicationCategoryLetter) => (
                <div style={styles.publicationCategoryBadgeContainer}>
                  <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
                </div>
              ))}
            </div>
          ) : (
            '-'
          ),
        width: 2,
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
        extractor: (problemReportWithDetails) => problemReportWithDetails.document?.status ?? 'rejected',
        render: (problemReportWithDetails) => (
          <DocumentStatusIcon
            status={problemReportWithDetails.document?.status ?? 'rejected'}
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
    const userRole = localStorage.userHandler.getRole();

    const validateDocumentOptionItem = {
      kind: 'text' as const,
      text: wordings.problemReportsPage.table.optionItems.validate,
      onClick: async () => {
        try {
          await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
            documentId: problemReportWithDetails.problemReport.documentId,
            status: documentModule.lib.getNextStatus({
              status: problemReportWithDetails.document?.status ?? 'rejected',
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
      isDisabled: userRole !== 'admin' || problemReportWithDetails.document?.status === 'rejected',
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
        props.refetch();
      },
      isDisabled: userRole !== 'admin',
      iconName: 'turnRight' as const,
    };
    const optionItems: Array<optionItemType> = [
      answerByEmailOptionItem,
      openDocumentOptionItem,
      reassignToWorkingUserOptionItem,
      validateDocumentOptionItem,
      deleteProblemReportOptionItem,
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
}

function isRowHighlighted(problemReportWithDetails: apiRouteOutType<'get', 'problemReportsWithDetails'>[number]) {
  return !problemReportWithDetails.problemReport.hasBeenRead;
}

function buildStyles(theme: customThemeType) {
  return {
    publicationCategoryBadgesContainer: {
      display: 'flex',
    },
    publicationCategoryBadgeContainer: {
      marginRight: theme.spacing,
    },
  };
}
