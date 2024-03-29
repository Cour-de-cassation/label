import { annotationType } from '@label/core';
import { viewerModeType } from './viewerMode';

export { buildDocumentViewerModeHandler };

export type { documentViewerModeHandlerType };

type documentViewerModeHandlerType = {
  isAnonymizedView: () => boolean;
  resetViewerMode: () => void;
  setOccurrenceMode: (
    category: annotationType['category'],
    entityId: annotationType['entityId'],
    entityLineNumbers: number[],
  ) => void;
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
    setViewerMode({
      kind: 'annotation',
      isAnonymizedView: documentViewerMode.isAnonymizedView,
    });
  }

  function isAnonymizedView() {
    return documentViewerMode.isAnonymizedView;
  }

  function setOccurrenceMode(
    category: annotationType['category'],
    entityId: annotationType['entityId'],
    entityLineNumbers: number[],
  ) {
    setViewerMode({
      kind: 'occurrence',
      category,
      entityId,
      entityLineNumbers,
      isAnonymizedView: documentViewerMode.isAnonymizedView,
    });
  }

  function switchAnonymizedView() {
    setViewerMode({ ...documentViewerMode, isAnonymizedView: !documentViewerMode.isAnonymizedView });
  }
}
