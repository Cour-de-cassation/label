import React, { ReactElement } from 'react';
import { annotationHandler, annotationLinkHandler, fetchedAnnotationType } from '@label/core';
import { IconButton, IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { useMonitoring } from '../../../../../services/monitoring';
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
  const { addMonitoringEntry } = useMonitoring();
  const linkedAnnotations = annotationLinkHandler.getLinkedAnnotations(
    props.annotation.entityId,
    annotatorState.annotations,
  );

  if (linkedAnnotations.length <= 1) {
    return renderIconButton();
  } else {
    return renderIconDropdown();
  }

  function renderIconDropdown() {
    return (
      <IconDropdown
        buttonSize={props.buttonSize}
        color="alert"
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
  }

  function renderIconButton() {
    return (
      <IconButton
        buttonSize={props.buttonSize}
        color="alert"
        hint={wordings.delete}
        iconName="delete"
        onClick={() => deleteAnnotation('one')}
      />
    );
  }

  function deleteAnnotation(deletionOption: typeof DELETION_OPTIONS[number]) {
    const newAnnotatorState = { ...annotatorState, annotations: computeNewAnnotations() };
    props.annotatorStateHandler.set(newAnnotatorState);

    props.onClose();

    function computeNewAnnotations() {
      switch (deletionOption) {
        case 'one':
          addMonitoringEntry({ description: 'delete_button_tooltip_one', type: 'button' });
          return annotationHandler.deleteById(annotatorState.annotations, props.annotation._id);
        case 'all':
          addMonitoringEntry({ description: 'delete_button_tooltip_all', type: 'button' });
          return annotationHandler.deleteByEntityId(annotatorState.annotations, props.annotation.entityId);
      }
    }
  }
}
