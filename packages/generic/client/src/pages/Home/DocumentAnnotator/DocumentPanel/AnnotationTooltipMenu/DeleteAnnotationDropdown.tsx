import React, { ReactElement } from 'react';
import format from 'string-template';
import { annotationHandler, annotationLinkHandler, annotationType } from '@label/core';
import { IconButton, IconDropdown } from 'pelta-design-system';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { DeleteAnnotationDropdown };

const DELETION_OPTIONS = ['annotation', 'representative', 'entity'] as const;

function DeleteAnnotationDropdown(props: {
  annotation: annotationType;
  buttonSize?: number;
  onClose: () => void;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();

  const annotatorState = annotatorStateHandler.get();
  const linkedAnnotations = annotationLinkHandler.getLinkedAnnotations(
    props.annotation.entityId,
    annotatorState.annotations,
  );
  const representatives = linkedAnnotations.filter((annotation) => annotation.text === props.annotation.text);

  if (linkedAnnotations.length <= 1) {
    return renderIconButton();
  } else {
    return renderIconDropdown();
  }

  function renderIconDropdown() {
    const items = buildDropdownItems();
    return (
      <IconDropdown
        buttonSize={props.buttonSize}
        backgroundColor="alert"
        hint={wordings.homePage.delete}
        iconName="deleteOutline"
        items={items}
        onChange={deleteAnnotation}
        onClose={props.onClose}
      />
    );
  }

  function renderIconButton() {
    return (
      <IconButton
        buttonSize={props.buttonSize}
        backgroundColor="alert"
        hint={wordings.homePage.delete}
        iconName="deleteOutline"
        onClick={() => deleteAnnotation('annotation')}
      />
    );
  }

  function buildDropdownItems() {
    if (representatives.length <= 1) {
      return DELETION_OPTIONS.filter((deletionOption) => deletionOption !== 'representative').map((deletionOption) => ({
        text: wordings.homePage.deletionOption[deletionOption],
        value: deletionOption,
      }));
    }
    return DELETION_OPTIONS.map((deletionOption) => {
      if (deletionOption === 'representative') {
        return {
          text: format(wordings.homePage.deletionOption[deletionOption], { count: representatives.length }),
          value: deletionOption,
        };
      }
      return {
        text: wordings.homePage.deletionOption[deletionOption],
        value: deletionOption,
      };
    });
  }

  function deleteAnnotation(deletionOption: typeof DELETION_OPTIONS[number]) {
    const newAnnotatorState = { ...annotatorState, annotations: computeNewAnnotations() };
    annotatorStateHandler.set(newAnnotatorState);

    props.onClose();

    function computeNewAnnotations() {
      switch (deletionOption) {
        case 'annotation':
          return annotationHandler.deleteByTextAndStart(annotatorState.annotations, props.annotation);
        case 'representative':
          return annotationHandler.deleteByTextAndCategory(annotatorState.annotations, props.annotation);
        case 'entity':
          return annotationHandler.deleteByEntityId(annotatorState.annotations, props.annotation.entityId);
      }
    }
  }
}
