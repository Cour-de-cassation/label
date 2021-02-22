import React, { ReactElement } from 'react';
import { annotationLinkHandler, annotationType } from '@label/core';
import { useAnnotatorStateHandler } from '../../services/annotatorState';
import { useMonitoring } from '../../services/monitoring';
import { wordings } from '../../wordings';
import { IconDropdown } from '../generic';

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
  const { addMonitoringEntry } = useMonitoring();
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
      items={linkableAnnotations.map((annotation) => ({
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
      addMonitoringEntry({
        action: `link_category_${props.annotation.category}`,
        origin: props.origin,
      });
    }
  }
}
