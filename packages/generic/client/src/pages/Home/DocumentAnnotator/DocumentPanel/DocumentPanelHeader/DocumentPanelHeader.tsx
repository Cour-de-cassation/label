import React, { ReactElement } from 'react';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { AnnotationHeader } from './AnnotationHeader';
import { ResizeHeader } from './ResizeHeader';
import { useDocumentViewerMode } from '../documentViewerMode';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: { annotatorStateHandler: annotatorStateHandlerType }): ReactElement {
  const { documentViewerModeHandler } = useDocumentViewerMode();
  return renderHeader();

  function renderHeader() {
    switch (documentViewerModeHandler.documentViewerMode.kind) {
      case 'annotation':
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
