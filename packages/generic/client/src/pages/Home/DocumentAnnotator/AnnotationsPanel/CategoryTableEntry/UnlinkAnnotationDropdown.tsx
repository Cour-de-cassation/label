import React, { ReactElement } from 'react';
import { annotationLinkHandler, fetchedAnnotationType } from '@label/core';
import { IconButton, IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { UnlinkAnnotationDropdown };

const UNLINK_ALL = '__all__';

function UnlinkAnnotationDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  buttonSize?: number;
  onClick?: () => void;
  onClose?: () => void;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const linkedAnnotations = annotationLinkHandler.getLinkedAnnotations(
    props.annotation.entityId,
    annotatorState.annotations,
  );

  if (linkedAnnotations.length <= 2) {
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
          ...linkedAnnotations.map((annotation) => ({
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
