import React, { createContext, ReactElement, useState } from 'react';
import { fetchedAnnotationType } from '@label/core';
import { buildDocumentViewerModeHandler, documentViewerModeHandlerType } from './buildDocumentViewerModeHandler';
import { DEFAULT_VIEWER_MODE, viewerModeType } from './viewerMode';

export { DocumentViewerModeHandlerContext, DocumentViewerModeHandlerContextProvider };

const DocumentViewerModeHandlerContext = createContext<documentViewerModeHandlerType>({
  checkViewerMode: () => null,
  isAnonymizedView: () => false,
  resetViewerMode: () => null,
  setOccurrenceMode: () => null,
  switchAnonymizedView: () => null,
  documentViewerMode: DEFAULT_VIEWER_MODE,
});

function DocumentViewerModeHandlerContextProvider(props: {
  annotations: fetchedAnnotationType[];
  children: ReactElement;
}): ReactElement {
  const [documentViewerMode, setViewerMode] = useState<viewerModeType>(DEFAULT_VIEWER_MODE);
  const documentViewerModeHandler = buildDocumentViewerModeHandler(documentViewerMode, setViewerMode);
  documentViewerModeHandler.checkViewerMode(props.annotations);

  return (
    <DocumentViewerModeHandlerContext.Provider value={documentViewerModeHandler}>
      {props.children}
    </DocumentViewerModeHandlerContext.Provider>
  );
}
