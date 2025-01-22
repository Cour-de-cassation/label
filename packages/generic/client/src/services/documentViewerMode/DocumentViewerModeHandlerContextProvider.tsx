import React, { createContext, ReactElement, useState } from 'react';
import { buildDocumentViewerModeHandler, documentViewerModeHandlerType } from './buildDocumentViewerModeHandler';
import { DEFAULT_VIEWER_MODE, viewerModeType } from './viewerMode';

export { DocumentViewerModeHandlerContext, DocumentViewerModeHandlerContextProvider };

const DocumentViewerModeHandlerContext = createContext<documentViewerModeHandlerType>({
  isAnonymizedView: () => false,
  resetViewerMode: () => null,
  setOccurrenceMode: () => null,
  setChecklistMode: () => null,
  switchAnonymizedView: () => null,
  documentViewerMode: DEFAULT_VIEWER_MODE,
});

function DocumentViewerModeHandlerContextProvider(props: { children: ReactElement }): ReactElement {
  const [documentViewerMode, setViewerMode] = useState<viewerModeType>(DEFAULT_VIEWER_MODE);
  const documentViewerModeHandler = buildDocumentViewerModeHandler(documentViewerMode, setViewerMode);

  return (
    <DocumentViewerModeHandlerContext.Provider value={documentViewerModeHandler}>
      {props.children}
    </DocumentViewerModeHandlerContext.Provider>
  );
}
