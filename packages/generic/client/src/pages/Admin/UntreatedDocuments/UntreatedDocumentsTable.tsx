import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType, documentType, idModule, timeOperator, userType } from '@label/core';
import {
  customThemeType,
  useCustomTheme,
  ConfirmationPopup,
  orderDirectionType,
  PaginatedTable,
  tableRowFieldType,
} from 'pelta-design-system';
import { apiCaller } from '../../../api';
import { PublicationCategoryBadge, DocumentStatusIcon } from '../../../components';
import { useAlert } from '../../../services/alert';
import { localStorage, untreatedDocumentOrderByProperties } from '../../../services/localStorage';
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
    const userRole = localStorage.userHandler.getRole();

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
      isDisabled: userRole !== 'admin',
    };

    const assignToWorkingUserOptionItem = {
      kind: 'selection' as const,
      text: wordings.untreatedDocumentsPage.table.optionItems.assignToWorkingUser.label,
      dropdownLabel: wordings.untreatedDocumentsPage.table.optionItems.assignToWorkingUser.dropdownLabel,
      description: wordings.untreatedDocumentsPage.table.optionItems.assignToWorkingUser.description,
      items: props.users.map(({ name }) => name),
      iconName: 'assignment' as const,
      onSelect: buildOnSelectWorkingUserToAssignDocument(untreatedDocument.document._id),
      isDisabled: userRole !== 'admin',
    };

    const freeDocumentOptionItem = {
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
      isDisabled: untreatedDocument.document.status !== 'pending',
    };

    return [
      openAnonymizedDocumentOptionItem,
      resetAndAssignToMyselfOptionItem,
      assignToWorkingUserOptionItem,
      freeDocumentOptionItem,
    ];
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
        title: wordings.business.filters.columnTitles.documentNumber,
        canBeSorted: true,
        extractor: (untreatedDocument) => untreatedDocument.document.documentNumber,
        width: 2,
      },
      {
        id: 'occultationBlock',
        title: wordings.business.filters.columnTitles.occultationBlock.title,
        tooltipText: wordings.business.filters.columnTitles.occultationBlock.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.occultationBlock || '-',
        getSortingValue: (treatedDocument) => treatedDocument.document.occultationBlock || 0,
        width: 1,
      },
      {
        id: 'jurisdiction',
        title: wordings.business.filters.columnTitles.jurisdiction.title,
        tooltipText: wordings.business.filters.columnTitles.jurisdiction.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.jurisdiction || '-',
        width: 4,
      },
      {
        id: 'publicationCategory',
        title: wordings.business.filters.columnTitles.publicationCategory.title,
        tooltipText: wordings.business.filters.columnTitles.publicationCategory.tooltipText,
        canBeSorted: true,
        getSortingValue: (untreatedDocument) => untreatedDocument.document.publicationCategory.length,
        extractor: (untreatedDocument) => untreatedDocument.document.publicationCategory.join(','),
        render: (untreatedDocument) =>
          untreatedDocument.document.publicationCategory.length > 0 ? (
            <div style={styles.publicationCategoryBadgesContainer}>
              {untreatedDocument.document.publicationCategory.map((publicationCategoryLetter) => (
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
        id: 'source',
        title: wordings.business.filters.columnTitles.source.title,
        tooltipText: wordings.business.filters.columnTitles.source.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => treatedDocument.document.source,
        width: 2,
      },
      {
        id: 'route',
        title: wordings.business.filters.columnTitles.route.title,
        tooltipText: wordings.business.filters.columnTitles.route.tooltipText,
        canBeSorted: true,
        extractor: (treatedDocument) => wordings.business.documentRoute[treatedDocument.document.route],
        width: 2,
      },
      {
        id: 'userName',
        title: wordings.business.filters.columnTitles.userName,
        canBeSorted: true,
        width: 10,
        extractor: (untreatedDocument) =>
          untreatedDocument.userNames.length > 0 ? untreatedDocument.userNames.join(', ') : '-',
      },
      {
        id: 'status',
        canBeSorted: true,
        title: wordings.business.filters.columnTitles.status,
        extractor: (untreatedDocument) => untreatedDocument.document.status,
        render: (untreatedDocument) => (
          <DocumentStatusIcon status={untreatedDocument.document.status} iconSize={TABLE_ICON_SIZE} />
        ),
        width: 1,
      },
      {
        id: 'decisionDate',
        title: wordings.business.filters.columnTitles.decisionDate.title,
        tooltipText: wordings.business.filters.columnTitles.decisionDate.tooltipText,
        canBeSorted: true,
        extractor: (untreatedDocument) =>
          untreatedDocument.document.decisionDate
            ? timeOperator.convertTimestampToReadableDate(untreatedDocument.document.decisionDate)
            : '-',
        getSortingValue: (untreatedDocument) => untreatedDocument.document.decisionDate || 0,
        width: 2,
      },
      {
        id: 'creationDate',
        title: wordings.business.filters.columnTitles.creationDate.title,
        tooltipText: wordings.business.filters.columnTitles.creationDate.tooltipText,
        canBeSorted: true,
        extractor: (untreatedDocument) =>
          untreatedDocument.document.creationDate
            ? timeOperator.convertTimestampToReadableDate(untreatedDocument.document.creationDate)
            : '-',
        getSortingValue: (untreatedDocument) => untreatedDocument.document.creationDate || 0,
        width: 2,
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
