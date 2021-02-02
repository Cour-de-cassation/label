import { annotationType } from '@label/core';
import { viewerModeType } from './viewerMode';

export { buildDocumentViewerModeHandler };

export type { documentViewerModeHandlerType };

type documentViewerModeHandlerType = {
  isAnonymizedView: () => boolean;
  resetViewerMode: () => void;
  setOccurrenceMode: (entityId: annotationType['entityId'], entityLineNumbers: number[]) => void;
  switchAnonymizedView: () => void;
  setHasScrolled: () => void;
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
    setHasScrolled,
    resetViewerMode,
  };

  function resetViewerMode() {
    setViewerMode({
      kind: 'annotation',
      isAnonymized: documentViewerMode.isAnonymized,
      hasScrolled: false,
    });
  }

  function isAnonymizedView() {
    return documentViewerMode.isAnonymized;
  }

  function setHasScrolled() {
    if (!documentViewerMode.hasScrolled) {
      setViewerMode({ ...documentViewerMode, hasScrolled: true });
    }
  }

  function setOccurrenceMode(entityId: annotationType['entityId'], entityLineNumbers: number[]) {
    setViewerMode({
      kind: 'occurrence',
      entityId,
      entityLineNumbers,
      isAnonymized: documentViewerMode.isAnonymized,
      hasScrolled: false,
    });
  }

  function switchAnonymizedView() {
    setViewerMode({ ...documentViewerMode, isAnonymized: !documentViewerMode.isAnonymized });
  }
}
