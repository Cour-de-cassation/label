import React from 'react';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../../services/documentViewerMode';
import { AnnotationHeader } from './AnnotationHeader';
import { OccurrenceHeader } from './OccurrenceHeader';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: { annotatorStateHandler: annotatorStateHandlerType }) {
  const documentViewerModeHandler = useDocumentViewerModeHandler();

  switch (documentViewerModeHandler.documentViewerMode.kind) {
    case 'annotation':
      return <AnnotationHeader />;
    case 'occurrence':
      const { entityId } = documentViewerModeHandler.documentViewerMode;
      return <OccurrenceHeader annotatorStateHandler={props.annotatorStateHandler} entityId={entityId} />;
  }
}
