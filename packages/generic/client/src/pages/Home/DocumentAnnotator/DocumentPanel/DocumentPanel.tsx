import React, { ReactElement } from 'react';
import { LayoutGrid } from '../../../../components';
import { annotatorStateHandlerType } from '../../../../services/annotatorState';
import { clientAnonymizerType } from '../../../../types';
import { DocumentPanelFooter } from './DocumentPanelFooter';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';
import { useDocumentViewerModeContext, DocumentViewerModeContext } from './documentViewerMode';

export { DocumentPanel };

function DocumentPanel(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  anonymizer: clientAnonymizerType;
  fetchNewDocument: () => Promise<void>;
}): ReactElement {
  const documentViewerModeContext = useDocumentViewerModeContext();

  return (
    <DocumentViewerModeContext.Provider value={documentViewerModeContext}>
      <LayoutGrid container>
        <DocumentPanelHeader annotatorStateHandler={props.annotatorStateHandler} />
        <DocumentViewer annotatorStateHandler={props.annotatorStateHandler} anonymizer={props.anonymizer} />
        <DocumentPanelFooter
          annotatorStateHandler={props.annotatorStateHandler}
          anonymizer={props.anonymizer}
          fetchNewDocument={props.fetchNewDocument}
        />
      </LayoutGrid>
    </DocumentViewerModeContext.Provider>
  );
}
