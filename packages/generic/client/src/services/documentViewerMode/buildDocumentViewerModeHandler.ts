import { fetchedAnnotationType } from '@label/core';
import { viewerModeType } from './viewerMode';

export { buildDocumentViewerModeHandler };

export type { documentViewerModeHandlerType };

type documentViewerModeHandlerType = {
  isAnonymizedView: () => boolean;
  resetViewerMode: () => void;
  setOccurrenceMode: (entityId: fetchedAnnotationType['entityId'], entityLineNumbers: number[]) => void;
  switchAnonymizedView: () => void;
  documentViewerMode: viewerModeType;
};

function buildDocumentViewerModeHandler(
  documentViewerMode: viewerModeType,
  setViewerMode: (documentViewerMode: viewerModeType) => void,
): documentViewerModeHandlerType {
  return {
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

  function setOccurrenceMode(entityId: fetchedAnnotationType['entityId'], entityLineNumbers: number[]) {
    setViewerMode({ kind: 'occurrence', entityId, entityLineNumbers, isAnonymized: documentViewerMode.isAnonymized });
  }

  function switchAnonymizedView() {
    setViewerMode({ ...documentViewerMode, isAnonymized: !documentViewerMode.isAnonymized });
  }
}
