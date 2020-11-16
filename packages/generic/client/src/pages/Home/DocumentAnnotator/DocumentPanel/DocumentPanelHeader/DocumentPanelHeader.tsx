import React, { ReactElement } from 'react';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { AnnotationHeader } from './AnnotationHeader';
import { ResizeHeader } from './ResizeHeader';
import { useViewerMode } from '../viewerMode';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: { annotatorStateHandler: annotatorStateHandlerType }): ReactElement {
  const { viewerModeHandler } = useViewerMode();
  return renderHeader();

  function renderHeader() {
    switch (viewerModeHandler.viewerMode.kind) {
      case 'annotation':
        return <AnnotationHeader annotatorStateHandler={props.annotatorStateHandler} />;
      case 'resize':
        return <ResizeHeader resetViewerMode={viewerModeHandler.resetViewerMode} />;
    }
  }
}
