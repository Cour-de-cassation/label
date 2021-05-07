import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType } from '@label/core';
import { PaginatedTable, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';
import { localStorage, treatedDocumentOrderByProperties } from '../../../services/localStorage';
import { AnnotationsDiffDrawer, annotationDiffDocumentInfoType } from './AnnotationsDiffDrawer';

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
  const [annotationDiffDocumentInfo, setAnnotationDiffDocumentInfo] = useState<
    annotationDiffDocumentInfoType | undefined
  >();

  const orderByProperty = localStorage.treatedDocumentsStateHandler.getOrderByProperty();
  const orderDirection = localStorage.treatedDocumentsStateHandler.getOrderDirection();
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      <AnnotationsDiffDrawer documentInfo={annotationDiffDocumentInfo} close={resetDrawer} />
      <PaginatedTable
        defaultOrderByProperty={orderByProperty}
        defaultOrderDirection={orderDirection}
        fields={props.fields}
        onOrderByPropertyChange={onOrderByPropertyChange}
        onOrderDirectionChange={onOrderDirectionChange}
        data={props.treatedDocuments}
        buildOptionItems={buildOptionItems}
      />
    </div>
  );
  function resetDrawer() {
    setAnnotationDiffDocumentInfo(undefined);
  }

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

  function buildOptionItems(treatmentWithDetails: apiRouteOutType<'get', 'treatedDocuments'>[number]) {
    return [
      {
        text: wordings.treatedDocumentsPage.table.optionItems.openDocument,
        onClick: () => {
          history.push(`/admin/document/${treatmentWithDetails.document._id}`);
          return;
        },
        iconName: 'eye' as const,
      },
      {
        text: wordings.treatedDocumentsPage.table.optionItems.displayAnnotationDiff,
        onClick: () => {
          setAnnotationDiffDocumentInfo({
            _id: treatmentWithDetails.document._id,
            documentNumber: treatmentWithDetails.document.documentNumber,
            userName: treatmentWithDetails.userNames[0],
          });
        },
        iconName: 'link' as const,
      },
    ];
  }
}
