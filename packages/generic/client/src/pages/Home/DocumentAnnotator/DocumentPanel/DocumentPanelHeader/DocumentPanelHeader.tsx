import React, { ReactElement } from 'react';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { AnnotationHeader } from './AnnotationHeader';
import { ResizeHeader } from './ResizeHeader';
import { useViewerMode } from '../viewerMode';

export { DocumentPanelHeader };

function DocumentPanelHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  isAnonymizedView: boolean;
  switchAnonymizedView: () => void;
}): ReactElement {
  const { viewerMode, resetViewerMode } = useViewerMode();
  return renderHeader();

  function renderHeader() {
    switch (viewerMode.kind) {
      case 'annotation':
        return (
          <AnnotationHeader
            annotatorStateHandler={props.annotatorStateHandler}
            switchAnonymizedView={props.switchAnonymizedView}
            isAnonymizedView={props.isAnonymizedView}
          />
        );
      case 'resize':
        return <ResizeHeader resetViewerMode={resetViewerMode} />;
    }
  }
}
