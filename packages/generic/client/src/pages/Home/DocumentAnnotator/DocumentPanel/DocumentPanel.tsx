import React, { ReactElement, useState } from 'react';
import { LayoutGrid } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { DocumentPanelFooter } from './DocumentPanelFooter';
import { DocumentPanelHeader, headerModeType } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';

export { DocumentPanel };

const DEFAULT_HEADER_MODE = 'annotation';

function DocumentPanel(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  fetchNewDocument: () => Promise<void>;
}): ReactElement {
  const [isAnonymizedView, setIsAnonymizedView] = useState(false);
  const [headerMode, setHeaderMode] = useState<headerModeType>(DEFAULT_HEADER_MODE);

  return (
    <LayoutGrid container>
      <DocumentPanelHeader
        annotatorStateHandler={props.annotatorStateHandler}
        headerMode={headerMode}
        isAnonymizedView={isAnonymizedView}
        resetHeaderMode={() => setHeaderMode(DEFAULT_HEADER_MODE)}
        switchAnonymizedView={switchAnonymizedView}
      />
      <DocumentViewer
        annotatorStateHandler={props.annotatorStateHandler}
        anonymizer={props.anonymizer}
        isAnonymizedView={isAnonymizedView}
        setHeaderMode={setHeaderMode}
      />
      <DocumentPanelFooter
        annotatorStateHandler={props.annotatorStateHandler}
        anonymizer={props.anonymizer}
        fetchNewDocument={props.fetchNewDocument}
      />
    </LayoutGrid>
  );

  function switchAnonymizedView() {
    setIsAnonymizedView(!isAnonymizedView);
  }
}
