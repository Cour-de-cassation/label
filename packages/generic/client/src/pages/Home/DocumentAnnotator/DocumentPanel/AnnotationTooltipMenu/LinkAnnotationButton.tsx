import React, { ReactElement } from 'react';
import { annotationModule, fetchedAnnotationType } from '@label/core';
import { IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { LinkAnnotationButton };

const LINK_ANNOTATION_MENU_WIDTH = 300;

function LinkAnnotationButton(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  disabled: boolean;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const linkableAnnotations = annotationModule.lib.annotationLinker.getLinkableAnnotations(
    props.annotation,
    annotatorState.annotations,
  );

  return (
    <IconDropdown
      disabled={isDisabled()}
      hint={wordings.link}
      iconName="link"
      items={linkableAnnotations.map((annotation) => ({
        displayedText: annotation.text,
        value: annotation.text,
      }))}
      onChange={linkToAnnotation}
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
