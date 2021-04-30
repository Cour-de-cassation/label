import React from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType, documentType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../components';
import { wordings } from '../../wordings';
import { apiCaller } from '../../api';

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
    if (specialDocument.status !== 'done') {
      return [];
    }

    const openAnonymizedDocumentOptionItem = {
      text: wordings.specialDocumentsPage.table.optionItems.openAnonymizedDocument,
      onClick: () => {
        history.push(`/anonymized-document/${specialDocument._id}`);
        return;
      },
    };

    const markAsPublishedOptionItem = specialDocument.markedAsPublished
      ? {
          text: wordings.specialDocumentsPage.table.optionItems.markAsUnPublished,
          onClick: async () => {
            await apiCaller.post<'updateDocumentMarkedAsPublished'>('updateDocumentMarkedAsPublished', {
              documentId: specialDocument._id,
              markedAsPublished: false,
            });
            props.refetch();
          },
        }
      : {
          text: wordings.specialDocumentsPage.table.optionItems.markAsPublished,
          onClick: async () => {
            await apiCaller.post<'updateDocumentMarkedAsPublished'>('updateDocumentMarkedAsPublished', {
              documentId: specialDocument._id,
              markedAsPublished: true,
            });
            props.refetch();
          },
        };

    return [openAnonymizedDocumentOptionItem, markAsPublishedOptionItem];
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
      extractor: (specialDocument) => computeStatusWording(specialDocument.status, specialDocument.markedAsPublished),
      width: 10,
    },
  ];
  return specialDocumentsFields;
}

function computeStatusWording(status: documentType['status'], markedAsPublished: documentType['markedAsPublished']) {
  if (status !== 'done') {
    return wordings.specialDocumentsPage.table.status.notTreated;
  }
  return markedAsPublished
    ? wordings.specialDocumentsPage.table.status.published
    : wordings.specialDocumentsPage.table.status.toBePublished;
}

function buildStyles() {
  return {
    container: {
      height: '100%',
    },
  };
}
