import React, { ReactElement, useState } from 'react';
import { annotationType, anonymizerType, documentType } from '@label/core';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';
import { LayoutGrid } from '../../../../components';
import { DocumentPanelFooter } from './DocumentPanelFooter';

export { DocumentPanel };

function DocumentPanel(props: {
  annotations: annotationType[];
  anonymizer: anonymizerType;
  document: documentType;
}): ReactElement {
  const [isAnonymizedView, setIsAnonymizedView] = useState(false);
  const [documentView, setDocumentView] = useState(props.document);

  return (
    <LayoutGrid container>
      <DocumentPanelHeader isAnonymizedView={isAnonymizedView} switchAnonymizedView={switchAnonymizedView} />
      <DocumentViewer document={documentView} />
      <DocumentPanelFooter />
    </LayoutGrid>
  );

  function switchAnonymizedView() {
    const newIsAnonymizedView = !isAnonymizedView;
    const newDocumentView = newIsAnonymizedView
      ? props.anonymizer.anonymizeDocument(props.document, props.annotations)
      : props.document;

    setIsAnonymizedView(newIsAnonymizedView);
    setDocumentView(newDocumentView);
  }
}
