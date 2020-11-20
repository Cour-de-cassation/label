import React, { ReactElement } from 'react';
import { annotationModule, fetchedAnnotationType } from '@label/core';
import { annotatorStateHandlerType } from '../../services/annotatorState';
import { wordings } from '../../wordings';
import { IconDropdown } from '../generic';

export { LinkAnnotationDropdown };

const LINK_ANNOTATION_MENU_WIDTH = 300;

function LinkAnnotationDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  buttonSize?: number;
  disabled: boolean;
  onClose?: () => void;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const linkableAnnotations = annotationModule.lib.annotationLinker.getLinkableAnnotations(
    props.annotation,
    annotatorState.annotations,
  );

  return (
    <IconDropdown
      buttonSize={props.buttonSize}
      disabled={isDisabled()}
      hint={wordings.link}
      iconName="link"
      items={linkableAnnotations.map((annotation) => ({
        text: annotation.text,
        value: annotation.text,
      }))}
      onChange={linkToAnnotation}
      onClose={props.onClose}
      width={LINK_ANNOTATION_MENU_WIDTH}
    />
  );

  function isDisabled() {
    return props.disabled || linkableAnnotations.length === 0;
  }

  function linkToAnnotation(text: string) {
    const annotationToLinkTo = linkableAnnotations.find((annotation) => annotation.text === text);

    if (annotationToLinkTo) {
      const newAnnotatorState = {
        ...annotatorState,
        annotations: annotationModule.lib.annotationLinker.link(
          props.annotation,
          annotationToLinkTo,
          annotatorState.annotations,
        ),
      };

      props.annotatorStateHandler.set(newAnnotatorState);
    }
  }
}
