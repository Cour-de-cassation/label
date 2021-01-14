import React from 'react';
import { useDocumentViewerModeHandler } from '../../../../../services/documentViewerMode';
import { AnnotationHeader } from './AnnotationHeader';
import { OccurrenceHeader } from './OccurrenceHeader';

export { DocumentPanelHeader };

function DocumentPanelHeader() {
  const documentViewerModeHandler = useDocumentViewerModeHandler();

  switch (documentViewerModeHandler.documentViewerMode.kind) {
    case 'annotation':
      return <AnnotationHeader />;
    case 'occurrence':
      const { entityId } = documentViewerModeHandler.documentViewerMode;
      return <OccurrenceHeader entityId={entityId} />;
  }
}
