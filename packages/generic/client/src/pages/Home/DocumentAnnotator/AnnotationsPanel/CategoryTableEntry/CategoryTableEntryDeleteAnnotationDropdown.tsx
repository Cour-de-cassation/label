import React from 'react';
import { annotationHandler, annotationLinkHandler, annotationType } from '@label/core';
import { IconDropdown, IconButton } from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useMonitoring } from '../../../../../services/monitoring';
import { wordings } from '../../../../../wordings';

const DELETE_ALL = '__all__';

export { CategoryTableEntryDeleteAnnotationDropdown };

function CategoryTableEntryDeleteAnnotationDropdown(props: { buttonSize: number; entityAnnotation: annotationType }) {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { addMonitoringEntry } = useMonitoring();
  const annotatorState = annotatorStateHandler.get();
  const linkedAnnotationRepresentatives = annotationLinkHandler.getLinkedAnnotationRepresentatives(
    props.entityAnnotation.entityId,
    annotatorState.annotations,
  );

  if (linkedAnnotationRepresentatives.length <= 1) {
    return renderIconButton();
  } else {
    return renderIconDropdown();
  }

  function renderIconDropdown() {
    return (
      <IconDropdown
        buttonSize={props.buttonSize}
        color="alert"
        hint={wordings.homePage.delete}
        iconName="delete"
        items={[
          {
            text: wordings.homePage.deletionOption.all,
            value: DELETE_ALL,
          },
          ...linkedAnnotationRepresentatives.map((annotation) => ({
            text: annotation.text,
            value: annotation.text,
          })),
        ]}
        onChange={deleteAnnotations}
      />
    );
  }

  function renderIconButton() {
    return (
      <IconButton
        buttonSize={props.buttonSize}
        color="alert"
        hint={wordings.homePage.delete}
        iconName="delete"
        onClick={() => deleteAnnotations(DELETE_ALL)}
      />
    );
  }

  function deleteAnnotations(text: string) {
    const newAnnotations =
      text === DELETE_ALL
        ? annotationHandler.deleteByEntityId(annotatorState.annotations, props.entityAnnotation.entityId)
        : annotationHandler.deleteByTextAndCategory(annotatorState.annotations, props.entityAnnotation);
    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    annotatorStateHandler.set(newAnnotatorState);
    addMonitoringEntry({
      origin: 'panel',
      action: text === DELETE_ALL ? 'delete_all' : 'delete_one',
    });
  }
}
