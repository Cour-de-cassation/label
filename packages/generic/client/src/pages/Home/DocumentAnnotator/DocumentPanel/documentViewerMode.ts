import { createContext, useContext, useState } from 'react';
import { fetchedAnnotationType } from '@label/core';

export { useDocumentViewerMode, DocumentViewerModeContext, useDocumentViewerModeContext };

export type { viewerModeType };

type viewerModeType =
  | { kind: 'annotation'; isAnonymized: boolean }
  | { kind: 'resize'; annotationId: fetchedAnnotationType['_id'] };

const DEFAULT_VIEWER_MODE: viewerModeType = { kind: 'annotation', isAnonymized: false };

const DocumentViewerModeContext = createContext<{
  documentViewerModeHandler: {
    isAnonymizedView: () => boolean;
    resetViewerMode: () => void;
    setResizeMode: (annotationId: fetchedAnnotationType['_id']) => void;
    setViewerMode: (documentViewerMode: viewerModeType) => void;
    switchAnonymizedView: () => void;
    documentViewerMode: viewerModeType;
  };
}>({
  documentViewerModeHandler: {
    isAnonymizedView: () => false,
    resetViewerMode: () => null,
    setResizeMode: () => null,
    setViewerMode: () => null,
    switchAnonymizedView: () => null,
    documentViewerMode: DEFAULT_VIEWER_MODE,
  },
});

function useDocumentViewerMode() {
  return useContext(DocumentViewerModeContext);
}

function useDocumentViewerModeContext() {
  const [documentViewerMode, setViewerMode] = useState<viewerModeType>(DEFAULT_VIEWER_MODE);
  return buildViewerModeContext(documentViewerMode, setViewerMode);
}

function buildViewerModeContext(
  documentViewerMode: viewerModeType,
  setViewerMode: (documentViewerMode: viewerModeType) => void,
) {
  const documentViewerModeHandler = {
    isAnonymizedView,
    setResizeMode,
    switchAnonymizedView,
    setViewerMode,
    documentViewerMode,
    resetViewerMode,
  };

  return { documentViewerModeHandler };

  function resetViewerMode() {
    setViewerMode(DEFAULT_VIEWER_MODE);
  }

  function isAnonymizedView() {
    return documentViewerMode.kind === 'annotation' && documentViewerMode.isAnonymized;
  }

  function setResizeMode(annotationId: fetchedAnnotationType['_id']) {
    if (documentViewerMode.kind === 'annotation' && !documentViewerMode.isAnonymized) {
      setViewerMode({ kind: 'resize', annotationId });
    }
  }

  function switchAnonymizedView() {
    if (documentViewerMode.kind === 'annotation') {
      setViewerMode({ kind: 'annotation', isAnonymized: !documentViewerMode.isAnonymized });
    }
  }
}
