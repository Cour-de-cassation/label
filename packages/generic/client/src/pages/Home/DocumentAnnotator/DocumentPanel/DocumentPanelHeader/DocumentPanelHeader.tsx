import React, { ReactElement } from 'react';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { AnnotationHeader } from './AnnotationHeader';
import { ResizeHeader } from './ResizeHeader';

export { DocumentPanelHeader };

export type { headerModeType };

type headerModeType = 'annotation' | 'resize';

function DocumentPanelHeader(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  isAnonymizedView: boolean;
  headerMode: headerModeType;
  resetHeaderMode: () => void;
  switchAnonymizedView: () => void;
}): ReactElement {
  return renderHeader();

  function renderHeader() {
    switch (props.headerMode) {
      case 'annotation':
        return (
          <AnnotationHeader
            annotatorStateHandler={props.annotatorStateHandler}
            switchAnonymizedView={props.switchAnonymizedView}
            isAnonymizedView={props.isAnonymizedView}
          />
        );
      case 'resize':
        return <ResizeHeader resetHeaderMode={props.resetHeaderMode} />;
    }
  }
}
