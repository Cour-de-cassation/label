import React from 'react';
import { apiRouteOutType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';
import { apiCaller } from '../../../api';

export { UntreatedDocumentsTable };

function UntreatedDocumentsTable(props: {
  fields: Array<tableRowFieldType<apiRouteOutType<'get', 'untreatedDocuments'>[number]>>;
  refetch: () => void;
  untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
}) {
  const styles = buildStyles();
  const optionItems = buildOptionItems();

  return (
    <div style={styles.container}>
      <PaginatedTable fields={props.fields} data={props.untreatedDocuments} optionItems={optionItems} />
    </div>
  );

  function buildOptionItems() {
    return [
      {
        text: wordings.untreatedDocumentsPage.table.optionItems.freeDocument,
        onClick: async (untreatedDocument: apiRouteOutType<'get', 'untreatedDocuments'>[number]) => {
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
}

function buildStyles() {
  return {
    container: {
      height: '100%',
    },
  };
}
