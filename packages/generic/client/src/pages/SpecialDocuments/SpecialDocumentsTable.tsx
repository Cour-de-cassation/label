import React from 'react';
import { useHistory } from 'react-router';
import { apiRouteOutType } from '@label/core';
import { DocumentStatusIcon, PaginatedTable, tableRowFieldType } from '../../components';
import { wordings } from '../../wordings';
import { apiCaller } from '../../api';

export { SpecialDocumentsTable };

const TABLE_ICON_SIZE = 24;

function SpecialDocumentsTable(props: {
  specialDocuments: apiRouteOutType<'get', 'specialDocuments'>;
  refetch: () => void;
}) {
  const history = useHistory();
  const fields = buildSpecialDocumentsFields();
  const styles = buildStyles();
  const optionItems = buildOptionItems();
  return (
    <div style={styles.container}>
      <PaginatedTable
        fields={fields}
        data={props.specialDocuments.filter((document) => document.status === 'done')}
        optionItems={optionItems}
      />
    </div>
  );

  function buildOptionItems() {
    return [
      {
        text: wordings.specialDocumentsPage.table.optionItems.openAnonymizedDocument,
        onClick: (specialDocument: apiRouteOutType<'get', 'specialDocuments'>[number]) => {
          history.push(`/anonymized-document/${specialDocument._id}`);
          return;
        },
      },
      {
        text: wordings.specialDocumentsPage.table.optionItems.markAsPublished,
        onClick: async (specialDocument: apiRouteOutType<'get', 'specialDocuments'>[number]) => {
          await apiCaller.post<'updateDocumentMarkedAsPublished'>('updateDocumentMarkedAsPublished', {
            documentId: specialDocument._id,
            markedAsPublished: true,
          });
          props.refetch();
        },
      },
    ];
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
      extractor: (specialDocument) => specialDocument.status,
      render: (specialDocument) => (
        <DocumentStatusIcon status={specialDocument.status} iconSize={TABLE_ICON_SIZE}></DocumentStatusIcon>
      ),
      width: 10,
    },
  ];
  return specialDocumentsFields;
}

function buildStyles() {
  return {
    container: {
      height: '100%',
    },
  };
}
