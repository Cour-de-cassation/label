import React, { ReactElement, useState } from 'react';
import { LayoutGrid } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { DocumentPanelFooter } from './DocumentPanelFooter';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';
import { DEFAULT_VIEWER_MODE, ViewerModeContext, viewerModeType } from './viewerMode';

export { DocumentPanel };

function DocumentPanel(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  fetchNewDocument: () => Promise<void>;
}): ReactElement {
  const [isAnonymizedView, setIsAnonymizedView] = useState(false);
  const [viewerMode, setViewerMode] = useState<viewerModeType>(DEFAULT_VIEWER_MODE);
  const viewerModeContext = { viewerMode, setViewerMode, resetViewerMode: () => setViewerMode(DEFAULT_VIEWER_MODE) };

  return (
    <ViewerModeContext.Provider value={viewerModeContext}>
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
        <DocumentPanelFooter
          annotatorStateHandler={props.annotatorStateHandler}
          anonymizer={props.anonymizer}
          fetchNewDocument={props.fetchNewDocument}
        />
      </LayoutGrid>
    </ViewerModeContext.Provider>
  );

  function switchAnonymizedView() {
    setIsAnonymizedView(!isAnonymizedView);
  }
}
