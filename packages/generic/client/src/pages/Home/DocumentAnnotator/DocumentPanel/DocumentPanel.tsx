import React, { ReactElement, useState } from 'react';
import { anonymizerType } from '@label/core';
import { LayoutGrid } from '../../../../components';
import { annotatorStateType } from '../../../../services/annotatorState';
import { DocumentPanelFooter } from './DocumentPanelFooter';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';

export { DocumentPanel };

function DocumentPanel(props: { annotatorState: annotatorStateType; anonymizer: anonymizerType }): ReactElement {
  const [isAnonymizedView, setIsAnonymizedView] = useState(false);

  return (
    <LayoutGrid container>
      <DocumentPanelHeader isAnonymizedView={isAnonymizedView} switchAnonymizedView={switchAnonymizedView} />
      <DocumentViewer
        annotatorState={props.annotatorState}
        anonymizer={props.anonymizer}
        isAnonymizedView={isAnonymizedView}
      />
      <DocumentPanelFooter />
    </LayoutGrid>
  );

  function switchAnonymizedView() {
    setIsAnonymizedView(!isAnonymizedView);
  }
}
