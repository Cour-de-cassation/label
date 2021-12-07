import React from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType, timeOperator, idModule, userType } from '@label/core';
import {
  DocumentReviewStatusIcon,
  PaginatedTable,
  PublicationCategoryBadge,
  tableRowFieldType,
} from '../../../components';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { routes } from '../../routes';
import { toBeConfirmedDocumentOrderByProperties } from '../../../services/localStorage';
import { convertDocumentReviewStatusToFilter } from '../../../services/filters';

export { ToBeConfirmedDocumentsTable };

const TABLE_ICON_SIZE = 28;

function ToBeConfirmedDocumentsTable(props: {
  refetch: () => void;
  users: Array<Pick<userType, '_id' | 'name'>>;
  toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>;
}) {
  const theme = useCustomTheme();
  const history = useHistory();

  const styles = buildStyles(theme);
  const fields = buildToBeConfirmedDocumentsFields();

  return (
    <div style={styles.container}>
      <PaginatedTable buildOptionItems={buildOptionItems} fields={fields} data={props.toBeConfirmedDocuments} />
    </div>
  );

  function buildOptionItems(toBeConfirmedDocument: apiRouteOutType<'get', 'toBeConfirmedDocuments'>[number]) {
    const openDocumentOption = {
      kind: 'text' as const,
      text: wordings.toBeConfirmedDocumentsPage.table.optionItems.openDocument,
      onClick: () =>
        history.push(routes.DOCUMENT.getPath(idModule.lib.convertToString(toBeConfirmedDocument.document._id))),
      iconName: 'find' as const,
    };

    return [openDocumentOption];
  }

  function buildToBeConfirmedDocumentsFields() {
    const toBeConfirmedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'toBeConfirmedDocuments'>[number],
      typeof toBeConfirmedDocumentOrderByProperties[number]
    >> = [
      {
        id: 'documentNumber',
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.number.title,
        tooltipText: wordings.toBeConfirmedDocumentsPage.table.columnTitles.number.tooltipText,
        canBeSorted: true,
        extractor: (toBeConfirmedDocument) => toBeConfirmedDocument.document.documentNumber,
        width: 2,
      },
      {
        id: 'occultationBlock',
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.occultationBlock.title,
        tooltipText: wordings.toBeConfirmedDocumentsPage.table.columnTitles.occultationBlock.tooltipText,
        canBeSorted: true,
        extractor: (toBeConfirmedDocument) => toBeConfirmedDocument.document.occultationBlock || '-',
        getSortingValue: (toBeConfirmedDocument) => toBeConfirmedDocument.document.occultationBlock || 0,
        width: 1,
      },
      {
        id: 'jurisdiction',
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.jurisdiction.title,
        tooltipText: wordings.toBeConfirmedDocumentsPage.table.columnTitles.jurisdiction.tooltipText,
        canBeSorted: true,
        extractor: (toBeConfirmedDocument) => toBeConfirmedDocument.document.jurisdiction || '-',
        width: 4,
      },
      {
        id: 'publicationCategory',
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.publicationCategory.title,
        tooltipText: wordings.toBeConfirmedDocumentsPage.table.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        getSortingValue: (toBeConfirmedDocument) => toBeConfirmedDocument.document.publicationCategory.length,
        extractor: (toBeConfirmedDocument) => toBeConfirmedDocument.document.publicationCategory.join(','),
        render: (toBeConfirmedDocument) =>
          toBeConfirmedDocument.document.publicationCategory.length > 0 ? (
            <div style={styles.publicationCategoryBadgesContainer}>
              {toBeConfirmedDocument.document.publicationCategory.map((publicationCategoryLetter) => (
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
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.workingUser.title,
        tooltipText: wordings.toBeConfirmedDocumentsPage.table.columnTitles.workingUser.tooltipText,
        canBeSorted: true,
        extractor: (toBeConfirmedDocument) => toBeConfirmedDocument.userNames.join(', '),
        width: 6,
      },
      {
        id: 'reviewStatus',
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.reviewStatus.title,
        tooltipText: wordings.toBeConfirmedDocumentsPage.table.columnTitles.reviewStatus.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => convertDocumentReviewStatusToFilter(treatedDocument.document.reviewStatus),
        render: (treatedDocument) =>
          convertDocumentReviewStatusToFilter(treatedDocument.document.reviewStatus) === 'none' ? (
            '-'
          ) : (
            <DocumentReviewStatusIcon iconSize={TABLE_ICON_SIZE} reviewStatus={treatedDocument.document.reviewStatus} />
          ),
        width: 1,
      },
      {
        id: 'date',
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.date,
        canBeSorted: true,
        extractor: (toBeConfirmedDocument) =>
          toBeConfirmedDocument.lastTreatmentDate !== undefined
            ? timeOperator.convertTimestampToReadableDate(toBeConfirmedDocument.lastTreatmentDate, true)
            : '-',
        getSortingValue: (toBeConfirmedDocument) => toBeConfirmedDocument.lastTreatmentDate || 0,
        width: 3,
      },
      {
        id: 'duration',
        canBeSorted: true,
        title: wordings.toBeConfirmedDocumentsPage.table.columnTitles.duration.title,
        tooltipText: wordings.toBeConfirmedDocumentsPage.table.columnTitles.duration.tooltipText,
        extractor: (toBeConfirmedDocument) =>
          toBeConfirmedDocument.totalTreatmentDuration !== undefined
            ? timeOperator.convertDurationToReadableDuration(toBeConfirmedDocument.totalTreatmentDuration)
            : '-',
        getSortingValue: (toBeConfirmedDocument) => toBeConfirmedDocument.totalTreatmentDuration || 0,
        width: 1,
      },
    ];
    return toBeConfirmedDocumentsFields;
  }
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      height: '100%',
    },
    publicationCategoryBadgesContainer: {
      display: 'flex',
    },
    publicationCategoryBadgeContainer: {
      marginRight: theme.spacing,
    },
  };
}
