import React, { ReactElement } from 'react';
import { annotationLinkHandler, fetchedAnnotationType } from '@label/core';
import { IconButton, IconDropdown } from '..';
import { annotatorStateHandlerType } from '../../services/annotatorState';
import { useMonitoring } from '../../services/monitoring';
import { wordings } from '../../wordings';

export { UnlinkAnnotationDropdown };

const UNLINK_ALL = '__all__';

function UnlinkAnnotationDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  buttonSize?: number;
  context: 'tooltip_update' | 'panel';
  onClick?: () => void;
  onClose?: () => void;
}): ReactElement {
  const { addMonitoringEntry } = useMonitoring();
  const annotatorState = props.annotatorStateHandler.get();
  const linkedAnnotationRepresentatives = annotationLinkHandler.getLinkedAnnotationRepresentatives(
    props.annotation.entityId,
    annotatorState.annotations,
  );

  if (linkedAnnotationRepresentatives.length <= 2) {
    return renderIconButton();
  } else {
    return renderIconDropdown();
  }

  function renderIconDropdown() {
    return (
      <IconDropdown
        buttonSize={props.buttonSize}
        disabled={isNotLinked()}
        hint={wordings.unlink}
        iconName="unlink"
        items={[
          {
            text: wordings.unlinkOption[UNLINK_ALL],
            value: UNLINK_ALL,
          },
          ...linkedAnnotationRepresentatives.map((annotation) => ({
            text: annotation.text,
            value: annotation.text,
          })),
        ]}
        onChange={unlinkAnnotation}
        onClick={props.onClick}
        onClose={props.onClose}
      />
    );
  }

  function renderIconButton() {
    return (
      <IconButton
        buttonSize={props.buttonSize}
        disabled={isNotLinked()}
        hint={wordings.unlink}
        iconName="unlink"
        onClick={() => unlinkAnnotation(props.annotation.text)}
      />
    );
  }

  function isNotLinked() {
    return !annotationLinkHandler.isLinked(props.annotation, annotatorState.annotations);
  }

  function unlinkAnnotation(text: string) {
    addMonitoringEntry({
      description: `${props.context}_unlink_${text === UNLINK_ALL ? 'all' : 'one'}`,
      type: 'button',
    });

    const newAnnotations =
      text === UNLINK_ALL
        ? annotationLinkHandler.unlink(props.annotation, annotatorState.annotations)
        : unlinkOnAnnotation(text);

    if (newAnnotations) {
      const newAnnotatorState = {
        ...annotatorState,
        annotations: newAnnotations,
      };

      props.annotatorStateHandler.set(newAnnotatorState);
    }

    props.onClose && props.onClose();
  }

  function unlinkOnAnnotation(text: string) {
    const annotationToUnlink = annotatorState.annotations.find(
      (annotation) => annotation.category === props.annotation.category && annotation.text === text,
    );

    if (annotationToUnlink) {
      return annotationLinkHandler.unlinkByCategoryAndText(annotationToUnlink, annotatorState.annotations);
    }
  }
}
