import { fetchedAnnotationType } from '@label/core';
import { viewerModeType } from './viewerMode';

export { buildDocumentViewerModeHandler };

export type { documentViewerModeHandlerType };

type documentViewerModeHandlerType = {
  isAnonymizedView: () => boolean;
  resetViewerMode: () => void;
  setResizeMode: (annotation: fetchedAnnotationType) => void;
  setOccurrenceMode: (entityId: fetchedAnnotationType['entityId']) => void;
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
    setResizeMode,
    switchAnonymizedView,
    documentViewerMode,
    resetViewerMode,
  };

  function resetViewerMode() {
    switch (documentViewerMode.kind) {
      case 'annotation':
      case 'occurrence':
        setViewerMode({ kind: 'annotation', isAnonymized: documentViewerMode.isAnonymized });
        break;
      case 'resize':
        setViewerMode({ kind: 'annotation', isAnonymized: false });
        break;
    }
  }

  function isAnonymizedView() {
    switch (documentViewerMode.kind) {
      case 'annotation':
      case 'occurrence':
        return documentViewerMode.isAnonymized;
      case 'resize':
        return false;
    }
  }

  function setOccurrenceMode(entityId: fetchedAnnotationType['entityId']) {
    switch (documentViewerMode.kind) {
      case 'annotation':
      case 'occurrence':
        setViewerMode({ kind: 'occurrence', entityId, isAnonymized: documentViewerMode.isAnonymized });
        break;
    }
  }

  function setResizeMode(annotation: fetchedAnnotationType) {
    switch (documentViewerMode.kind) {
      case 'annotation':
      case 'occurrence':
        !documentViewerMode.isAnonymized && setViewerMode({ kind: 'resize', annotation });
        break;
    }
  }

  function switchAnonymizedView() {
    switch (documentViewerMode.kind) {
      case 'annotation':
      case 'occurrence':
        setViewerMode({ ...documentViewerMode, isAnonymized: !documentViewerMode.isAnonymized });
        break;
    }
  }
}
