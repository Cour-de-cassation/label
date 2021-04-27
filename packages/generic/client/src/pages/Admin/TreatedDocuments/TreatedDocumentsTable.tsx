import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType, documentType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';
import { localStorage, treatedDocumentOrderByProperties } from '../../../services/localStorage';
import { AnnotationsDiffDrawer } from './AnnotationsDiffDrawer';

export { TreatedDocumentsTable };

function TreatedDocumentsTable(props: {
  fields: Array<
    tableRowFieldType<
      apiRouteOutType<'get', 'treatedDocuments'>[number],
      typeof treatedDocumentOrderByProperties[number]
    >
  >;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
}) {
  const history = useHistory();
  const [annotationDiffDocumentId, setAnnotationDiffDocumentId] = useState<documentType['_id'] | undefined>();

  const orderByProperty = localStorage.treatedDocumentsStateHandler.getOrderByProperty();
  const orderDirection = localStorage.treatedDocumentsStateHandler.getOrderDirection();
  const styles = buildStyles();
  const optionItems = buildOptionItems();
  return (
    <div style={styles.container}>
      <AnnotationsDiffDrawer
        documentId={annotationDiffDocumentId}
        isOpen={!!annotationDiffDocumentId}
        close={() => setAnnotationDiffDocumentId(undefined)}
      />

      <PaginatedTable
        defaultOrderByProperty={orderByProperty}
        defaultOrderDirection={orderDirection}
        fields={props.fields}
        onOrderByPropertyChange={onOrderByPropertyChange}
        onOrderDirectionChange={onOrderDirectionChange}
        data={props.treatedDocuments}
        optionItems={optionItems}
      />
    </div>
  );

  function onOrderByPropertyChange(newOrderByProperty: typeof treatedDocumentOrderByProperties[number]) {
    localStorage.treatedDocumentsStateHandler.setOrderByProperty(newOrderByProperty);
  }

  function onOrderDirectionChange(newOrderDirection: 'asc' | 'desc') {
    localStorage.treatedDocumentsStateHandler.setOrderDirection(newOrderDirection);
  }

  function buildStyles() {
    return {
      container: {
        height: '100%',
      },
    };
  }

  function buildOptionItems() {
    return [
      {
        text: wordings.treatedDocumentsPage.table.optionItems.openDocument,
        onClick: (treatmentWithDetails: apiRouteOutType<'get', 'treatedDocuments'>[number]) => {
          history.push(`/admin/document/${treatmentWithDetails.document._id}`);
          return;
        },
        iconName: 'eye',
      },
      {
        text: wordings.treatedDocumentsPage.table.optionItems.displayAnnotationDiff,
        onClick: (treatmentWithDetails: apiRouteOutType<'get', 'treatedDocuments'>[number]) => {
          setAnnotationDiffDocumentId(treatmentWithDetails.document._id);
        },
        iconName: 'link',
      },
    ];
  }
}
