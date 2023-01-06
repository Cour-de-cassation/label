import React, { ReactElement } from 'react';
import { IconDropdown } from 'pelta-design-system';
import { annotationLinkHandler, annotationModule, annotationType } from '@label/core';
import { useAnnotatorStateHandler } from '../../services/annotatorState';
import { wordings } from '../../wordings';

export { LinkAnnotationDropdown };

const LINK_ANNOTATION_MENU_WIDTH = 300;

function LinkAnnotationDropdown(props: {
  annotation: annotationType;
  origin: 'document' | 'panel';
  buttonSize?: number;
  onClick?: () => void;
  onClose?: () => void;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const annotatorState = annotatorStateHandler.get();
  const linkableAnnotations = annotationLinkHandler.getLinkableAnnotations(
    props.annotation,
    annotatorState.annotations,
  );

  return (
    <IconDropdown
      buttonSize={props.buttonSize}
      disabled={linkableAnnotations.length === 0}
      hint={wordings.homePage.link}
      iconName="link"
      items={linkableAnnotations.sort(annotationModule.lib.comparator.compareByText).map((annotation) => ({
        text: annotation.text,
        value: annotation.text,
      }))}
      onChange={linkToAnnotation}
      onClick={props.onClick}
      onClose={props.onClose}
      width={LINK_ANNOTATION_MENU_WIDTH}
    />
  );

  function linkToAnnotation(text: string) {
    const annotationToLinkTo = linkableAnnotations.find((annotation) => annotation.text === text);

    if (annotationToLinkTo) {
      const newAnnotatorState = {
        ...annotatorState,
        annotations: annotationLinkHandler.link(props.annotation, annotationToLinkTo, annotatorState.annotations),
      };

      annotatorStateHandler.set(newAnnotatorState);
    }
  }
}
