import React, { ReactElement } from 'react';
import { annotationModule, fetchedAnnotationType } from '@label/core';
import { annotatorStateHandlerType } from '../../services/annotatorState';
import { wordings } from '../../wordings';
import { IconButton } from '../generic';

export { UnlinkAnnotationButton };

function UnlinkAnnotationButton(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  buttonSize?: number;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();

  return (
    <IconButton
      buttonSize={props.buttonSize}
      color="default"
      disabled={isNotLinked()}
      hint={wordings.unlink}
      iconName="unlink"
      onClick={unlinkAnnotation}
    />
  );

  function isNotLinked() {
    return !annotationModule.lib.annotationLinker.isLinked(props.annotation, annotatorState.annotations);
  }

  function unlinkAnnotation() {
    const newAnnotatorState = {
      ...annotatorState,
      annotations: annotationModule.lib.annotationLinker.unlink(props.annotation, annotatorState.annotations),
    };

    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
