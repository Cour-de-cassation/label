import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiRouteOutType, documentType, idModule } from '@label/core';
import { apiCaller } from '../../../api';
import { PaginatedTable, tableRowFieldType, ConfirmationPopup, orderDirectionType } from 'pelta-design-system';
import { wordings } from '../../../wordings';
import { localStorage, treatedDocumentOrderByProperties } from '../../../services/localStorage';
import { AnnotationsDiffDrawer, annotationDiffDocumentInfoType } from './AnnotationsDiffDrawer';
import { useAlert } from '../../../services/alert';
import { routes } from '../../routes';

export { TreatedDocumentsTable };

function TreatedDocumentsTable(props: {
  fields: Array<
    tableRowFieldType<
      apiRouteOutType<'get', 'treatedDocuments'>[number],
      typeof treatedDocumentOrderByProperties[number]
    >
  >;
  refetch: () => void;
  treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
}) {
  const history = useHistory();
  const [documentIdToReset, setDocumentIdToReset] = useState<documentType['_id'] | undefined>(undefined);
  const { displayAlert } = useAlert();
  const [annotationDiffDocumentInfo, setAnnotationDiffDocumentInfo] = useState<
    annotationDiffDocumentInfoType | undefined
  >();

  const orderByProperty = localStorage.treatedDocumentsStateHandler.getOrderByProperty();
  const orderDirection = localStorage.treatedDocumentsStateHandler.getOrderDirection();
  const styles = buildStyles();

  return (
    <div style={styles.container}>
      {!!documentIdToReset && (
        <ConfirmationPopup
          text={wordings.treatedDocumentsPage.table.resetDocumentConfirmationPopup.text}
          onConfirm={() => onConfirmResetDocument(documentIdToReset)}
          onCancel={() => setDocumentIdToReset(undefined)}
        />
      )}
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

  function onOrderDirectionChange(newOrderDirection: orderDirectionType) {
    localStorage.treatedDocumentsStateHandler.setOrderDirection(newOrderDirection);
  }

  async function onConfirmResetDocument(documentIdToReset: documentType['_id']) {
    setDocumentIdToReset(undefined);
    try {
      await apiCaller.post<'deleteHumanTreatmentsForDocument'>('deleteHumanTreatmentsForDocument', {
        documentId: documentIdToReset,
      });
      props.refetch();
    } catch (error) {
      displayAlert({
        text: wordings.business.errors.deleteHumanTreatmentsByDocumentIdFailed,
        variant: 'alert',
        autoHide: true,
      });
      console.warn(error);
    }
  }

  function buildStyles() {
    return {
      container: {
        height: '100%',
      },
    };
  }

  function buildOptionItems(treatmentWithDetails: apiRouteOutType<'get', 'treatedDocuments'>[number]) {
    const userRole = localStorage.userHandler.getRole();

    const openDocumentOption = {
      kind: 'text' as const,
      text: wordings.treatedDocumentsPage.table.optionItems.openDocument,
      onClick: () =>
        history.push(routes.DOCUMENT.getPath(idModule.lib.convertToString(treatmentWithDetails.document._id))),
      iconName: 'find' as const,
    };

    const displayAnnotationDiff = {
      kind: 'text' as const,
      text: wordings.treatedDocumentsPage.table.optionItems.displayAnnotationDiff,
      onClick: () =>
        setAnnotationDiffDocumentInfo({
          _id: treatmentWithDetails.document._id,
          documentNumber: treatmentWithDetails.document.documentNumber,
          userName: treatmentWithDetails.userNames[0],
        }),
      iconName: 'link' as const,
    };

    const resetDocument = {
      kind: 'text' as const,
      text: wordings.treatedDocumentsPage.table.optionItems.resetTheDocument,
      onClick: () => setDocumentIdToReset(treatmentWithDetails.document._id),
      iconName: 'restore' as const,
      isDisabled: userRole !== 'admin',
    };
    return [openDocumentOption, displayAnnotationDiff, resetDocument];
  }
}
