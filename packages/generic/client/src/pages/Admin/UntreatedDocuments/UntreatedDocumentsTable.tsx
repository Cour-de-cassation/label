import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType, documentType, idModule, timeOperator, userType } from '@label/core';
import { apiCaller } from '../../../api';
import {
  ConfirmationPopup,
  DocumentStatusIcon,
  orderDirectionType,
  PaginatedTable,
  PublicationCategoryBadge,
  tableRowFieldType,
} from '../../../components';
import { useAlert } from '../../../services/alert';
import { localStorage, untreatedDocumentOrderByProperties } from '../../../services/localStorage';
import { customThemeType, useCustomTheme } from '../../../styles';
import { wordings } from '../../../wordings';
import { routes } from '../../routes';

export { UntreatedDocumentsTable };

const TABLE_ICON_SIZE = 24;

function UntreatedDocumentsTable(props: {
  refetch: () => void;
  users: Array<Pick<userType, '_id' | 'name'>>;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
}) {
  const history = useHistory();
  const theme = useCustomTheme();
  const { displayAlert } = useAlert();
  const [documentIdToUpdateStatus, setDocumentIdToUpdateStatus] = useState<documentType['_id'] | undefined>(undefined);

  const orderByProperty = localStorage.untreatedDocumentsStateHandler.getOrderByProperty();
  const orderDirection = localStorage.untreatedDocumentsStateHandler.getOrderDirection();
  const styles = buildStyles(theme);
  const fields = buildUntreatedDocumentsFields();

  return (
    <div style={styles.container}>
      {!!documentIdToUpdateStatus && (
        <ConfirmationPopup
          text={wordings.untreatedDocumentsPage.table.assignDocumentConfirmationPopup.text}
          onConfirm={() => onConfirmUpdateDocumentStatus(documentIdToUpdateStatus)}
          onCancel={() => setDocumentIdToUpdateStatus(undefined)}
        />
      )}
      <PaginatedTable
        fields={fields}
        data={props.untreatedDocuments}
        buildOptionItems={buildOptionItems}
        onOrderByPropertyChange={onOrderByPropertyChange}
        onOrderDirectionChange={onOrderDirectionChange}
        defaultOrderByProperty={orderByProperty}
        defaultOrderDirection={orderDirection}
      />
    </div>
  );

  function onOrderByPropertyChange(newOrderByProperty: typeof untreatedDocumentOrderByProperties[number]) {
    localStorage.untreatedDocumentsStateHandler.setOrderByProperty(newOrderByProperty);
  }

  function onOrderDirectionChange(newOrderDirection: orderDirectionType) {
    localStorage.untreatedDocumentsStateHandler.setOrderDirection(newOrderDirection);
  }

  function buildOptionItems(untreatedDocument: apiRouteOutType<'get', 'untreatedDocuments'>[number]) {
    const openAnonymizedDocumentOptionItem = {
      kind: 'text' as const,
      text: wordings.untreatedDocumentsPage.table.optionItems.openAnonymizedDocument,
      onClick: () => {
        history.push(routes.ANONYMIZED_DOCUMENT.getPath(idModule.lib.convertToString(untreatedDocument.document._id)));
        return;
      },
      iconName: 'eye' as const,
    };
    const resetAndAssignToMyselfOptionItem = {
      kind: 'text' as const,
      text: wordings.untreatedDocumentsPage.table.optionItems.assignToMyself,
      onClick: () => {
        setDocumentIdToUpdateStatus(untreatedDocument.document._id);
      },
      iconName: 'restore' as const,
    };

    const assignToWorkingUserOptionItem = {
      kind: 'selection' as const,
      text: wordings.untreatedDocumentsPage.table.optionItems.assignToWorkingUser.label,
      dropdownLabel: wordings.untreatedDocumentsPage.table.optionItems.assignToWorkingUser.dropdownLabel,
      description: wordings.untreatedDocumentsPage.table.optionItems.assignToWorkingUser.description,
      items: props.users.map(({ name }) => name),
      iconName: 'assignment' as const,
      onSelect: buildOnSelectWorkingUserToAssignDocument(untreatedDocument.document._id),
    };

    const userRole = localStorage.userHandler.getRole();
    switch (userRole) {
      case 'scrutator':
        return [openAnonymizedDocumentOptionItem];
      case 'admin':
        if (untreatedDocument.document.status !== 'pending') {
          return [openAnonymizedDocumentOptionItem, resetAndAssignToMyselfOptionItem, assignToWorkingUserOptionItem];
        }
        return [
          openAnonymizedDocumentOptionItem,
          resetAndAssignToMyselfOptionItem,
          {
            kind: 'text' as const,
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
      default:
        return [];
    }
  }

  function buildOnSelectWorkingUserToAssignDocument(documentId: documentType['_id']) {
    return async (userName: string) => {
      const user = props.users.find(({ name }) => name === userName);
      if (!user) {
        return;
      }
      await releaseAndAssignDocumentToUser({ documentId, userId: user._id });
    };
  }

  async function onConfirmUpdateDocumentStatus(documentIdToUpdateStatus: documentType['_id']) {
    setDocumentIdToUpdateStatus(undefined);
    const userId = localStorage.userHandler.getId();
    if (!userId) {
      displayAlert({ text: wordings.business.errors.noUserIdFound, variant: 'alert', autoHide: true });
      return;
    }
    await releaseAndAssignDocumentToUser({ userId, documentId: documentIdToUpdateStatus });
  }

  async function releaseAndAssignDocumentToUser({
    documentId,
    userId,
  }: {
    userId: userType['_id'];
    documentId: documentType['_id'];
  }) {
    try {
      await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
        documentId,
        status: 'free',
      });
    } catch (error) {
      displayAlert({ text: wordings.business.errors.updateDocumentStatusFailed, variant: 'alert', autoHide: true });
      console.warn(error);
      return;
    }
    try {
      await apiCaller.post<'assignDocumentToUser'>('assignDocumentToUser', {
        documentId,
        userId,
      });
    } catch (error) {
      displayAlert({ text: wordings.business.errors.assignDocumentFailed, variant: 'alert', autoHide: true });
      console.warn(error);
      return;
    }
    props.refetch();
  }

  function buildUntreatedDocumentsFields() {
    const untreatedDocumentsFields: Array<tableRowFieldType<
      apiRouteOutType<'get', 'untreatedDocuments'>[number],
      typeof untreatedDocumentOrderByProperties[number]
    >> = [
      {
        id: 'documentNumber',
        title: wordings.untreatedDocumentsPage.table.columnTitles.number,
        canBeSorted: true,
        extractor: (untreatedDocument) => untreatedDocument.document.documentNumber,
        width: 2,
      },
      {
        id: 'occultationBlock',
        title: wordings.untreatedDocumentsPage.table.columnTitles.occultationBlock.title,
        tooltipText: wordings.untreatedDocumentsPage.table.columnTitles.occultationBlock.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.occultationBlock || '',
        getSortingValue: (treatedDocument) => treatedDocument.document.occultationBlock || 0,
        width: 1,
      },
      {
        id: 'jurisdiction',
        title: wordings.untreatedDocumentsPage.table.columnTitles.jurisdiction.title,
        tooltipText: wordings.untreatedDocumentsPage.table.columnTitles.jurisdiction.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.jurisdiction || '',
        width: 4,
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
        id: 'session',
        title: wordings.untreatedDocumentsPage.table.columnTitles.session.title,
        tooltipText: wordings.untreatedDocumentsPage.table.columnTitles.session.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.session,
        width: 3,
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
        id: 'decisionDate',
        title: wordings.untreatedDocumentsPage.table.columnTitles.decisionDate.title,
        tooltipText: wordings.untreatedDocumentsPage.table.columnTitles.decisionDate.tooltipText,
        canBeSorted: true,
        extractor: (untreatedDocument) =>
          untreatedDocument.document.decisionDate
            ? timeOperator.convertTimestampToReadableDate(untreatedDocument.document.decisionDate)
            : '-',
        getSortingValue: (untreatedDocument) => untreatedDocument.document.decisionDate || 0,
        width: 3,
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
