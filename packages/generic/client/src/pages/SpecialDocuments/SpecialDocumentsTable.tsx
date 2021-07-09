import React from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType, documentModule, documentType, idModule, timeOperator } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../components';
import { wordings } from '../../wordings';
import { apiCaller } from '../../api';
import { routes } from '../routes';

export { SpecialDocumentsTable };

function SpecialDocumentsTable(props: {
  specialDocuments: apiRouteOutType<'get', 'specialDocuments'>;
  refetch: () => void;
}) {
  const history = useHistory();
  const fields = buildSpecialDocumentsFields();
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      <PaginatedTable fields={fields} data={props.specialDocuments} buildOptionItems={buildOptionItems} />
    </div>
  );

  function buildOptionItems(specialDocument: apiRouteOutType<'get', 'specialDocuments'>[number]) {
    const openAnonymizedDocumentOptionItem = {
      kind: 'text' as const,
      text: wordings.specialDocumentsPage.table.optionItems.openAnonymizedDocument,
      onClick: () => {
        history.push(routes.ANONYMIZED_DOCUMENT.getPath(idModule.lib.convertToString(specialDocument._id)));
        return;
      },
    };

    switch (specialDocument.status) {
      case 'toBePublished':
        return [
          openAnonymizedDocumentOptionItem,
          {
            kind: 'text' as const,
            text: wordings.specialDocumentsPage.table.optionItems.markAsPublished,
            onClick: async () => {
              await apiCaller.post<'updatePublishableDocumentStatus'>('updatePublishableDocumentStatus', {
                documentId: specialDocument._id,
                status: documentModule.lib.getNextStatus({
                  status: specialDocument.status,
                  publicationCategory: specialDocument.publicationCategory,
                }) as 'done' | 'toBePublished',
              });
              props.refetch();
            },
          },
        ];
      case 'done':
        return [
          openAnonymizedDocumentOptionItem,
          {
            kind: 'text' as const,
            text: wordings.specialDocumentsPage.table.optionItems.markAsUnPublished,
            onClick: async () => {
              await apiCaller.post<'updatePublishableDocumentStatus'>('updatePublishableDocumentStatus', {
                documentId: specialDocument._id,
                status: 'toBePublished',
              });
              props.refetch();
            },
          },
        ];
      default:
        return [];
    }
  }
}

function buildSpecialDocumentsFields() {
  const specialDocumentsFields: Array<tableRowFieldType<apiRouteOutType<'get', 'specialDocuments'>[number]>> = [
    {
      id: 'documentNumber',
      title: wordings.specialDocumentsPage.table.columnTitles.number,
      canBeSorted: true,
      extractor: (specialDocument) => JSON.stringify(specialDocument.documentNumber),
      width: 10,
    },
    {
      id: 'status',
      title: wordings.specialDocumentsPage.table.columnTitles.status,
      canBeSorted: true,
      extractor: (specialDocument) => computeStatusWording(specialDocument.status),
      width: 10,
    },
    {
      id: 'creationDate',
      title: wordings.specialDocumentsPage.table.columnTitles.importDate,
      canBeSorted: true,
      extractor: (specialDocument) => timeOperator.convertTimestampToReadableDate(specialDocument.creationDate, true),
      getSortingValue: (specialDocument) => specialDocument.creationDate,
      width: 10,
    },
  ];
  return specialDocumentsFields;
}

function computeStatusWording(status: documentType['status']) {
  switch (status) {
    case 'done':
      return wordings.specialDocumentsPage.table.status.published;
    case 'toBePublished':
      return wordings.specialDocumentsPage.table.status.toBePublished;
    default:
      return wordings.specialDocumentsPage.table.status.notTreated;
  }
}

function buildStyles() {
  return {
    container: {
      height: '100%',
    },
  };
}
