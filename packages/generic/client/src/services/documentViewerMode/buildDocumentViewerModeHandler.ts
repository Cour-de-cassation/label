import { fetchedAnnotationType } from '@label/core';
import { viewerModeType } from './viewerMode';

export { buildDocumentViewerModeHandler };

export type { documentViewerModeHandlerType };

type documentViewerModeHandlerType = {
  checkViewerMode: (annotations: fetchedAnnotationType[]) => void;
  isAnonymizedView: () => boolean;
  resetViewerMode: () => void;
  setOccurrenceMode: (entityId: fetchedAnnotationType['entityId']) => void;
  switchAnonymizedView: () => void;
  documentViewerMode: viewerModeType;
};

function buildDocumentViewerModeHandler(
  documentViewerMode: viewerModeType,
  setViewerMode: (documentViewerMode: viewerModeType) => void,
): documentViewerModeHandlerType {
  return {
    checkViewerMode,
    isAnonymizedView,
    setOccurrenceMode,
    switchAnonymizedView,
    documentViewerMode,
    resetViewerMode,
  };

  function resetViewerMode() {
    setViewerMode({ kind: 'annotation', isAnonymized: documentViewerMode.isAnonymized });
  }

  function isAnonymizedView() {
    return documentViewerMode.isAnonymized;
  }

  function setOccurrenceMode(entityId: fetchedAnnotationType['entityId']) {
    setViewerMode({ kind: 'occurrence', entityId, isAnonymized: documentViewerMode.isAnonymized });
  }

  function switchAnonymizedView() {
    setViewerMode({ ...documentViewerMode, isAnonymized: !documentViewerMode.isAnonymized });
  }

  function checkViewerMode(annotations: fetchedAnnotationType[]) {
    if (documentViewerMode.kind === 'occurrence') {
      const isEntityEmpty = !annotations.some((annotation) => annotation.entityId === documentViewerMode.entityId);
      if (isEntityEmpty) {
        setViewerMode({ kind: 'annotation', isAnonymized: documentViewerMode.isAnonymized });
      }
    }
  }
}
