import React, { ReactElement, useState } from 'react';
import { annotationType, anonymizerType, documentType, settingsType } from '@label/core';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';
import { LayoutGrid } from '../../../../components';
import { DocumentPanelFooter } from './DocumentPanelFooter';

export { DocumentPanel };

function DocumentPanel(props: {
  annotations: annotationType[];
  anonymizer: anonymizerType;
  document: documentType;
  settings: settingsType;
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
        settings={props.settings}
      />
      <DocumentPanelFooter />
    </LayoutGrid>
  );

  function switchAnonymizedView() {
    setIsAnonymizedView(!isAnonymizedView);
  }
}
