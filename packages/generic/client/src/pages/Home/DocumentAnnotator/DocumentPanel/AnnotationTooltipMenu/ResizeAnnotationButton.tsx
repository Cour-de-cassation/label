import React, { ReactElement } from 'react';
import { fetchedAnnotationType, fetchedAnnotationHandler } from '@label/core';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { IconButton } from '../../../../../components';
import { wordings } from '../../../../../wordings';

export { ResizeAnnotationButton };

function ResizeAnnotationButton(props: {
  onClick: () => void;
  disabled: boolean;
  annotatorStateHandler: annotatorStateHandlerType;
  annotationId: fetchedAnnotationType['_id'];
}): ReactElement {
  return (
    <IconButton
      color="default"
      hint={wordings.resize}
      iconName="resize"
      disabled={props.disabled}
      onClick={onResizeAnnotationClick}
    />
  );

  function onResizeAnnotationClick() {
    const annotatorState = props.annotatorStateHandler.get();
    const newAnnotations = fetchedAnnotationHandler.deleteOne(annotatorState.annotations, props.annotationId);
    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
    props.onClick();
  }
}
