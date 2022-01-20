import React from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType, documentModule, idModule, timeOperator } from '@label/core';
import { orderDirectionType, PaginatedTable, tableRowFieldType } from 'pelta-design-system';
import { localStorage, publishableDocumentOrderByProperties } from '../../services/localStorage';
import { wordings } from '../../wordings';
import { apiCaller } from '../../api';
import { routes } from '../routes';

export { PublishableDocumentsTable };

function PublishableDocumentsTable(props: {
  publishableDocuments: apiRouteOutType<'get', 'publishableDocuments'>;
  refetch: () => void;
}) {
  const history = useHistory();
  const fields = buildPublishableDocumentsFields();
  const styles = buildStyles();
  const orderByProperty = localStorage.publishableDocumentsStateHandler.getOrderByProperty();
  const orderDirection = localStorage.publishableDocumentsStateHandler.getOrderDirection();

  return (
    <div style={styles.container}>
      <PaginatedTable
        fields={fields}
        data={props.publishableDocuments}
        buildOptionItems={buildOptionItems}
        defaultOrderByProperty={orderByProperty}
        defaultOrderDirection={orderDirection}
        onOrderByPropertyChange={onOrderByPropertyChange}
        onOrderDirectionChange={onOrderDirectionChange}
      />
    </div>
  );

  function onOrderByPropertyChange(newOrderByProperty: typeof publishableDocumentOrderByProperties[number]) {
    localStorage.publishableDocumentsStateHandler.setOrderByProperty(newOrderByProperty);
  }

  function onOrderDirectionChange(newOrderDirection: orderDirectionType) {
    localStorage.publishableDocumentsStateHandler.setOrderDirection(newOrderDirection);
  }

  function buildOptionItems(publishableDocument: apiRouteOutType<'get', 'publishableDocuments'>[number]) {
    const openAnonymizedDocumentOptionItem = {
      kind: 'text' as const,
      text: wordings.publishableDocumentsPage.table.optionItems.openAnonymizedDocument,
      onClick: () => {
        history.push(routes.ANONYMIZED_DOCUMENT.getPath(idModule.lib.convertToString(publishableDocument._id)));
        return;
      },
    };

    const markAsPublished = {
      kind: 'text' as const,
      text: wordings.publishableDocumentsPage.table.optionItems.markAsPublished,
      onClick: async () => {
        await apiCaller.post<'updatePublishableDocumentStatus'>('updatePublishableDocumentStatus', {
          documentId: publishableDocument._id,
          status: documentModule.lib.getNextStatus({
            status: publishableDocument.status,
            publicationCategory: publishableDocument.publicationCategory,
            route: publishableDocument.route,
          }) as 'done' | 'toBePublished',
        });
        props.refetch();
      },
    };

    const markAsUnpublished = {
      kind: 'text' as const,
      text: wordings.publishableDocumentsPage.table.optionItems.markAsUnPublished,
      onClick: async () => {
        await apiCaller.post<'updatePublishableDocumentStatus'>('updatePublishableDocumentStatus', {
          documentId: publishableDocument._id,
          status: 'toBePublished',
        });
        props.refetch();
      },
    };

    switch (publishableDocument.status) {
      case 'toBePublished':
        return [openAnonymizedDocumentOptionItem, markAsPublished];
      case 'done':
        return [openAnonymizedDocumentOptionItem, markAsUnpublished];
      default:
        return [];
    }
  }
}

function buildPublishableDocumentsFields() {
  const publishableDocumentsFields: Array<tableRowFieldType<
    apiRouteOutType<'get', 'publishableDocuments'>[number],
    typeof publishableDocumentOrderByProperties[number]
  >> = [
    {
      id: 'documentNumber',
      title: wordings.business.filters.columnTitles.documentNumber,
      canBeSorted: true,
      extractor: (publishableDocument) => JSON.stringify(publishableDocument.documentNumber),
      width: 10,
    },
    {
      id: 'jurisdiction',
      title: wordings.business.filters.columnTitles.jurisdiction.title,
      tooltipText: wordings.business.filters.columnTitles.jurisdiction.tooltipText,
      canBeSorted: true,
      extractor: (publishableDocument) => publishableDocument.jurisdiction,
      width: 10,
    },
    {
      id: 'chamberName',
      title: wordings.business.filters.columnTitles.chamberName,
      canBeSorted: true,
      extractor: (publishableDocument) => publishableDocument.chamberName,
      width: 10,
    },
    {
      id: 'appealNumber',
      title: wordings.business.filters.columnTitles.appealNumber,
      canBeSorted: true,
      extractor: (publishableDocument) => publishableDocument.appealNumber,
      width: 10,
    },
    {
      id: 'status',
      title: wordings.business.filters.columnTitles.status,
      canBeSorted: true,
      extractor: (publishableDocument) => wordings.business.documentStatus[publishableDocument.status],
      width: 10,
    },
    {
      id: 'creationDate',
      title: wordings.business.filters.columnTitles.creationDate.title,
      tooltipText: wordings.business.filters.columnTitles.creationDate.tooltipText,
      canBeSorted: true,
      extractor: (publishableDocument) =>
        publishableDocument.creationDate
          ? timeOperator.convertTimestampToReadableDate(publishableDocument.creationDate, true)
          : '-',
      getSortingValue: (publishableDocument) => publishableDocument.creationDate || 0,
      width: 10,
    },
  ];
  return publishableDocumentsFields;
}

function buildStyles() {
  return {
    container: {
      height: '100%',
    },
  };
}
