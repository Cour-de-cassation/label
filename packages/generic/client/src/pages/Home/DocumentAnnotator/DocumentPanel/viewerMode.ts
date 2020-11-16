import { createContext, useContext, useState } from 'react';
import { fetchedAnnotationType } from '@label/core';

export { useViewerMode, ViewerModeContext, useViewerModeContext };

export type { viewerModeType };

type viewerModeType =
  | { kind: 'annotation'; isAnonymized: boolean }
  | { kind: 'resize'; annotationId: fetchedAnnotationType['_id'] };

const DEFAULT_VIEWER_MODE: viewerModeType = { kind: 'annotation', isAnonymized: false };

const ViewerModeContext = createContext<{
  viewerModeHandler: {
    isAnonymizedView: () => boolean;
    resetViewerMode: () => void;
    setResizeMode: (annotationId: fetchedAnnotationType['_id']) => void;
    setViewerMode: (viewerMode: viewerModeType) => void;
    switchAnonymizedView: () => void;
    viewerMode: viewerModeType;
  };
}>({
  viewerModeHandler: {
    isAnonymizedView: () => false,
    resetViewerMode: () => null,
    setResizeMode: () => null,
    setViewerMode: () => null,
    switchAnonymizedView: () => null,
    viewerMode: DEFAULT_VIEWER_MODE,
  },
});

function useViewerMode() {
  return useContext(ViewerModeContext);
}

function useViewerModeContext() {
  const [viewerMode, setViewerMode] = useState<viewerModeType>(DEFAULT_VIEWER_MODE);
  return buildViewerModeContext(viewerMode, setViewerMode);
}

function buildViewerModeContext(viewerMode: viewerModeType, setViewerMode: (viewerMode: viewerModeType) => void) {
  const viewerModeHandler = {
    isAnonymizedView,
    setResizeMode,
    switchAnonymizedView,
    setViewerMode,
    viewerMode,
    resetViewerMode,
  };

  return { viewerModeHandler };

  function resetViewerMode() {
    setViewerMode(DEFAULT_VIEWER_MODE);
  }

  function isAnonymizedView() {
    return viewerMode.kind === 'annotation' && viewerMode.isAnonymized;
  }

  function setResizeMode(annotationId: fetchedAnnotationType['_id']) {
    if (viewerMode.kind === 'annotation' && !viewerMode.isAnonymized) {
      setViewerMode({ kind: 'resize', annotationId });
    }
  }

  function switchAnonymizedView() {
    if (viewerMode.kind === 'annotation') {
      setViewerMode({ kind: 'annotation', isAnonymized: !viewerMode.isAnonymized });
    }
  }
}
