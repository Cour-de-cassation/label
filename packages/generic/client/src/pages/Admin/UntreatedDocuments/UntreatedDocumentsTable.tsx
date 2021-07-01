import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType, documentType, idModule, timeOperator } from '@label/core';
import { apiCaller } from '../../../api';
import {
  ConfirmationPopup,
  DocumentStatusIcon,
  PaginatedTable,
  PublicationCategoryBadge,
  tableRowFieldType,
} from '../../../components';
import { useAlert } from '../../../services/alert';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { routes } from '../../routes';

export { UntreatedDocumentsTable };

const TABLE_ICON_SIZE = 24;

function UntreatedDocumentsTable(props: {
  refetch: () => void;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
}) {
  const history = useHistory();
  const theme = useCustomTheme();
  const { displayAlert } = useAlert();
  const [documentIdToUpdateStatus, setDocumentIdToUpdateStatus] = useState<documentType['_id'] | undefined>(undefined);

  const styles = buildStyles(theme);
  const fields = buildUntreatedDocumentsFields();

  return (
    <div style={styles.container}>
      {!!documentIdToUpdateStatus && (
        <ConfirmationPopup
          text={wordings.untreatedDocumentsPage.table.assignDocumentConfirmationPopup.text}
          onConfirm={() => onConfirmUpdateDocumentStatus(documentIdToUpdateStatus)}
          onClose={() => setDocumentIdToUpdateStatus(undefined)}
        />
      )}
      <PaginatedTable fields={fields} data={props.untreatedDocuments} buildOptionItems={buildOptionItems} />
    </div>
  );

  function buildOptionItems(untreatedDocument: apiRouteOutType<'get', 'untreatedDocuments'>[number]) {
    const openAnonymizedDocumentOptionItem = {
      text: wordings.untreatedDocumentsPage.table.optionItems.openAnonymizedDocument,
      onClick: () => {
        history.push(routes.ANONYMIZED_DOCUMENT.getPath(idModule.lib.convertToString(untreatedDocument.document._id)));
        return;
      },
      iconName: 'eye' as const,
    };
    const resetAndAssignToMyselfOptionItem = {
      text: wordings.untreatedDocumentsPage.table.optionItems.assignToMyself,
      onClick: () => {
        setDocumentIdToUpdateStatus(untreatedDocument.document._id);
      },
      iconName: 'restore' as const,
    };

    if (untreatedDocument.document.status !== 'pending') {
      return [openAnonymizedDocumentOptionItem, resetAndAssignToMyselfOptionItem];
    }
    return [
      openAnonymizedDocumentOptionItem,
      resetAndAssignToMyselfOptionItem,
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

  async function onConfirmUpdateDocumentStatus(documentIdToUpdateStatus: documentType['_id']) {
    setDocumentIdToUpdateStatus(undefined);
    try {
      await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
        documentId: documentIdToUpdateStatus,
        status: 'free',
      });
    } catch (error) {
      displayAlert({ text: wordings.business.errors.updateDocumentStatusFailed, variant: 'alert' });
      console.warn(error);
      return;
    }
    try {
      await apiCaller.post<'assignDocumentToUser'>('assignDocumentToUser', {
        documentId: documentIdToUpdateStatus,
      });
    } catch (error) {
      displayAlert({ text: wordings.business.errors.assignDocumentFailed, variant: 'alert' });
      console.warn(error);
      return;
    }

    props.refetch();
  }

  function buildUntreatedDocumentsFields() {
    const untreatedDocumentsFields: Array<tableRowFieldType<apiRouteOutType<'get', 'untreatedDocuments'>[number]>> = [
      {
        id: 'documentNumber',
        title: wordings.untreatedDocumentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (untreatedDocument) => untreatedDocument.document.documentNumber,
        width: 3,
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
        width: 2,
      },
      {
        id: 'source',
        title: wordings.untreatedDocumentsPage.table.columnTitles.source.title,
        tooltipText: wordings.untreatedDocumentsPage.table.columnTitles.source.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.source,
        width: 2,
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
        width: 5,
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
