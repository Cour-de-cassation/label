import React, { ReactElement } from 'react';
import { annotationModule, fetchedAnnotationType, settingsModule } from '@label/core';
import { IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { ChangeAnnotationCategoryDropdown };

const CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH = 300;

function ChangeAnnotationCategoryDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  shouldApplyEverywhere: boolean;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const categories = settingsModule.lib.getCategories(annotatorState.settings);

  return (
    <IconDropdown
      hint={wordings.changeCategory}
      iconName="changeCategory"
      items={categories.map((category) => ({
        displayedText: settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings),
        value: category,
      }))}
      onChange={changeAnnotationCategory}
      width={CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH}
    />
  );

  function changeAnnotationCategory(newCategory: string) {
    const newAnnotations = props.shouldApplyEverywhere
      ? annotationModule.lib.fetchedAnnotationHandler.updateManyCategory(
          annotatorState.annotations,
          props.annotation.entityId,
          newCategory,
        )
      : annotationModule.lib.fetchedAnnotationHandler.updateOneCategory(
          annotatorState.annotations,
          props.annotation._id,
          newCategory,
        );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
