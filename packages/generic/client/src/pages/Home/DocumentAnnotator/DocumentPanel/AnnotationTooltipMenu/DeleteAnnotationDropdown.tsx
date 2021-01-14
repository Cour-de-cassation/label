import React, { ReactElement } from 'react';
import { annotationHandler, annotationLinkHandler, fetchedAnnotationType } from '@label/core';
import { IconButton, IconDropdown } from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useMonitoring } from '../../../../../services/monitoring';
import { wordings } from '../../../../../wordings';

export { DeleteAnnotationDropdown };

const DELETION_OPTIONS = ['one', 'all'] as const;

function DeleteAnnotationDropdown(props: {
  annotation: fetchedAnnotationType;
  buttonSize?: number;
  onClose: () => void;
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();

  const annotatorState = annotatorStateHandler.get();
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
    annotatorStateHandler.set(newAnnotatorState);

    props.onClose();

    function computeNewAnnotations() {
      switch (deletionOption) {
        case 'one':
          addMonitoringEntry({ description: 'tooltip_delete_annotation_one', type: 'button' });
          return annotationHandler.deleteById(annotatorState.annotations, props.annotation._id);
        case 'all':
          addMonitoringEntry({ description: 'tooltip_delete_annotation_all', type: 'button' });
          return annotationHandler.deleteByEntityId(annotatorState.annotations, props.annotation.entityId);
      }
    }
  }
}
