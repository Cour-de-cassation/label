import { useContext } from 'react';
import { DocumentViewerModeHandlerContext } from './DocumentViewerModeHandlerContextProvider';

export { useDocumentViewerModeHandler };

function useDocumentViewerModeHandler() {
  return useContext(DocumentViewerModeHandlerContext);
}
