import React, { ReactElement } from 'react';
import { annotationModule, fetchedAnnotationType, idModule, settingsModule } from '@label/core';
import { uniq } from 'lodash';
import { IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { ChangeAnnotationCategoryButton };

const CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH = 300;

function ChangeAnnotationCategoryButton(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
  shouldApplyEverywhere: boolean;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const categories = uniq(annotatorState.annotations.map((annotation) => annotation.category));

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
    const newAnnotations = annotationModule.lib.fetchedAnnotationHandler.updateMany(
      annotatorState.annotations,
      props.shouldApplyEverywhere
        ? (annotation) => annotation.entityId === props.annotation.entityId
        : (annotation) => idModule.lib.equalId(annotation._id, props.annotation._id),
      (annotation) => ({
        ...annotation,
        category: newCategory,
      }),
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
