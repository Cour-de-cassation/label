import React from 'react';
import { apiRouteOutType, timeOperator } from '@label/core';
import { DocumentStatusIcon, PaginatedTable, PublicationCategoryBadge, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';
import { apiCaller } from '../../../api';
import { customThemeType, useCustomTheme } from '../../../styles';

export { UntreatedDocumentsTable };

const TABLE_ICON_SIZE = 24;

function UntreatedDocumentsTable(props: {
  refetch: () => void;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const fields = buildUntreatedDocumentsFields();

  return (
    <div style={styles.container}>
      <PaginatedTable fields={fields} data={props.untreatedDocuments} buildOptionItems={buildOptionItems} />
    </div>
  );

  function buildOptionItems(untreatedDocument: apiRouteOutType<'get', 'untreatedDocuments'>[number]) {
    if (untreatedDocument.document.status !== 'pending') {
      return [];
    }
    return [
      {
        text: wordings.untreatedDocumentsPage.table.optionItems.freeDocument,
        onClick: async () => {
          await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
            documentId: untreatedDocument.document._id,
            status: 'free',
          });
          props.refetch();
        },
        iconName: 'unlock' as const,
      },
    ];
  }

  function buildUntreatedDocumentsFields() {
    const untreatedDocumentsFields: Array<tableRowFieldType<apiRouteOutType<'get', 'untreatedDocuments'>[number]>> = [
      {
        id: 'documentNumber',
        title: wordings.untreatedDocumentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (untreatedDocument) => untreatedDocument.document.documentNumber,
        width: 10,
      },
      {
        id: 'publicationCategory',
        title: wordings.untreatedDocumentsPage.table.columnTitles.publicationCategory.title,
        tooltipText: wordings.untreatedDocumentsPage.table.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        getSortingValue: (untreatedDocument) => untreatedDocument.document.publicationCategory.length,
        extractor: (untreatedDocument) => untreatedDocument.document.publicationCategory.join(','),
        render: (untreatedDocument) => (
          <div style={styles.publicationCategoryBadgesContainer}>
            {untreatedDocument.document.publicationCategory.map((publicationCategoryLetter) => (
              <div style={styles.publicationCategoryBadgeContainer}>
                <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
              </div>
            ))}
          </div>
        ),
        width: 10,
      },
      {
        id: 'userName',
        title: wordings.untreatedDocumentsPage.table.columnTitles.userName,
        canBeSorted: true,
        width: 10,
        extractor: (untreatedDocument) =>
          untreatedDocument.userNames.length > 0 ? untreatedDocument.userNames.join(', ') : '-',
      },
      {
        id: 'status',
        canBeSorted: true,
        title: wordings.untreatedDocumentsPage.table.columnTitles.status,
        extractor: (untreatedDocument) => untreatedDocument.document.status,
        render: (untreatedDocument) => (
          <DocumentStatusIcon status={untreatedDocument.document.status} iconSize={TABLE_ICON_SIZE} />
        ),
        width: 1,
      },
      {
        id: 'creationDate',
        title: wordings.untreatedDocumentsPage.table.columnTitles.importDate,
        canBeSorted: true,
        extractor: (untreatedDocument) =>
          timeOperator.convertTimestampToReadableDate(untreatedDocument.document.creationDate, true),
        getSortingValue: (untreatedDocument) => untreatedDocument.document.creationDate,
        width: 10,
      },
    ];
    return untreatedDocumentsFields;
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
