import { createContext, useContext } from 'react';
import { fetchedAnnotationType } from '@label/core';

export { useViewerMode, ViewerModeContext, DEFAULT_VIEWER_MODE };

export type { viewerModeType };

type viewerModeType = { kind: 'annotation' } | { kind: 'resize'; annotation: fetchedAnnotationType };

const DEFAULT_VIEWER_MODE: viewerModeType = { kind: 'annotation' };

const ViewerModeContext = createContext<{
  viewerMode: viewerModeType;
  setViewerMode: (viewerMode: viewerModeType) => void;
  resetViewerMode: () => void;
}>({
  viewerMode: DEFAULT_VIEWER_MODE,
  setViewerMode: () => null,
  resetViewerMode: () => null,
});

function useViewerMode() {
  return useContext(ViewerModeContext);
}
