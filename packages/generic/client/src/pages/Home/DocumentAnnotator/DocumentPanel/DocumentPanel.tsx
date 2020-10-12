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

  return (
    <LayoutGrid container>
      <DocumentPanelHeader isAnonymizedView={isAnonymizedView} switchAnonymizedView={switchAnonymizedView} />
      <DocumentViewer
        annotations={props.annotations}
        anonymizer={props.anonymizer}
        document={props.document}
        isAnonymizedView={isAnonymizedView}
      />
      <DocumentPanelFooter />
    </LayoutGrid>
  );

  function switchAnonymizedView() {
    setIsAnonymizedView(!isAnonymizedView);
  }
}
