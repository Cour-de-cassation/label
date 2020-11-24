import React, { ReactElement } from 'react';
import { fetchedAnnotationType, fetchedAnnotationHandler } from '@label/core';
import { IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { DeleteAnnotationDropdown };

const DELETION_OPTIONS = ['one', 'all'] as const;

function DeleteAnnotationDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  buttonSize?: number;
  onClose: () => void;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();

  return (
    <IconDropdown
      buttonSize={props.buttonSize}
      color="secondary"
      hint={wordings.delete}
      iconName="delete"
      items={DELETION_OPTIONS.map((deletionOption) => ({
        text: wordings.deletionOption[deletionOption],
        value: deletionOption,
      }))}
      onChange={deleteAnnotation}
      onClose={props.onClose}
    />
  );

  function deleteAnnotation(deletionOption: typeof DELETION_OPTIONS[number]) {
    const newAnnotatorState = { ...annotatorState, annotations: computeNewAnnotations() };
    props.annotatorStateHandler.set(newAnnotatorState);

    props.onClose();

    function computeNewAnnotations() {
      switch (deletionOption) {
        case 'one':
          return fetchedAnnotationHandler.deleteById(annotatorState.annotations, props.annotation._id);
        case 'all':
          return fetchedAnnotationHandler.deleteByEntityId(annotatorState.annotations, props.annotation.entityId);
      }
    }
  }
}
