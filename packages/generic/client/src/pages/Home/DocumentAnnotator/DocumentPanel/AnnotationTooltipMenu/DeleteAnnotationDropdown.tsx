import React, { ReactElement } from 'react';
import { annotationHandler, annotationLinkHandler, annotationType } from '@label/core';
import { IconButton, IconDropdown } from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useMonitoring } from '../../../../../services/monitoring';
import { wordings } from '../../../../../wordings';

export { DeleteAnnotationDropdown };

const DELETION_OPTIONS = ['one', 'all'] as const;

function DeleteAnnotationDropdown(props: {
  annotation: annotationType;
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
        backgroundColor="alert"
        hint={wordings.homePage.delete}
        iconName="delete"
        items={DELETION_OPTIONS.map((deletionOption) => ({
          text: wordings.homePage.deletionOption[deletionOption],
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
        backgroundColor="alert"
        hint={wordings.homePage.delete}
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
          addMonitoringEntry({ origin: 'document', action: 'delete_annotation_one' });
          return annotationHandler.deleteByTextAndStart(annotatorState.annotations, props.annotation);
        case 'all':
          addMonitoringEntry({ origin: 'document', action: 'delete_annotation_all' });
          return annotationHandler.deleteByEntityId(annotatorState.annotations, props.annotation.entityId);
      }
    }
  }
}
