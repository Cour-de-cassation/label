import React, { ReactElement, useState } from 'react';
import { anonymizerType } from '@label/core';
import { LayoutGrid } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { fetchedAnnotationType } from '../../../../types';
import { DocumentPanelFooter } from './DocumentPanelFooter';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';

export { DocumentPanel };

function DocumentPanel(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: anonymizerType<fetchedAnnotationType>;
}): ReactElement {
  const [isAnonymizedView, setIsAnonymizedView] = useState(false);

  return (
    <LayoutGrid container>
      <DocumentPanelHeader
        annotatorStateHandler={props.annotatorStateHandler}
        isAnonymizedView={isAnonymizedView}
        switchAnonymizedView={switchAnonymizedView}
      />
      <DocumentViewer
        annotatorStateHandler={props.annotatorStateHandler}
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
