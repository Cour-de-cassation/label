import React from 'react';
import { annotationHandler, annotationLinkHandler, annotationType, settingsModule } from '@label/core';
import { IconDropdown, IconButton } from 'pelta-design-system';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';
import { useAlert } from '../../../../../services/alert';

const DELETE_ALL = '__all__';

export { CategoryTableEntryDeleteAnnotationDropdown };

function CategoryTableEntryDeleteAnnotationDropdown(props: { buttonSize: number; entityAnnotation: annotationType }) {
  const { displayAlert } = useAlert();
  const annotatorStateHandler = useAnnotatorStateHandler();
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
        backgroundColor="alert"
        hint={wordings.homePage.delete}
        iconName="deleteOutline"
        items={[
          {
            text: wordings.homePage.deletionOption.entity,
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
        backgroundColor="alert"
        hint={wordings.homePage.delete}
        iconName="deleteOutline"
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
    if (props.entityAnnotation.category === settingsModule.lib.motivationCategoryHandler.getCategoryName()) {
      displayAlert({
        text: wordings.business.errors.deleteMotivationOccultationAlert,
        variant: 'info',
        autoHide: false,
      });
    }
  }
}
