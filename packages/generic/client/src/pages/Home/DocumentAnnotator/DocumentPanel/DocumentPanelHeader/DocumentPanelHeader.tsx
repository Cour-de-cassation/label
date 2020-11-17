import React, { ReactElement } from 'react';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { useDocumentViewerModeHandler } from '../../../../../services/documentViewerMode';
import { AnnotationHeader } from './AnnotationHeader';
import { ResizeHeader } from './ResizeHeader';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: { annotatorStateHandler: annotatorStateHandlerType }): ReactElement {
  const documentViewerModeHandler = useDocumentViewerModeHandler();
  return renderHeader();

  function renderHeader() {
    switch (documentViewerModeHandler.documentViewerMode.kind) {
      case 'annotation':
      case 'occurrence':
        return <AnnotationHeader annotatorStateHandler={props.annotatorStateHandler} />;
      case 'resize':
        return (
          <ResizeHeader
            annotationToResize={documentViewerModeHandler.documentViewerMode.annotation}
            annotatorStateHandler={props.annotatorStateHandler}
            resetViewerMode={documentViewerModeHandler.resetViewerMode}
          />
        );
    }
  }
}
