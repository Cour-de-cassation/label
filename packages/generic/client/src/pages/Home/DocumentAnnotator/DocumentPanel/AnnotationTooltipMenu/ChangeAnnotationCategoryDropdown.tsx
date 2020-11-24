import React, { ReactElement } from 'react';
import { fetchedAnnotationType, fetchedAnnotationHandler, settingsModule } from '@label/core';
import { CategoryIcon, IconDropdown } from '../../../../../components';
import { annotatorStateHandlerType } from '../../../../../services/annotatorState';
import { wordings } from '../../../../../wordings';

export { ChangeAnnotationCategoryDropdown };

const CATEGORY_ICON_SIZE = 30;
const CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH = 300;

function ChangeAnnotationCategoryDropdown(props: {
  annotatorStateHandler: annotatorStateHandlerType;
  annotation: fetchedAnnotationType;
}): ReactElement {
  const annotatorState = props.annotatorStateHandler.get();
  const categories = settingsModule.lib.getCategories(annotatorState.settings);

  return (
    <IconDropdown
      hint={wordings.changeCategory}
      iconName="changeCategory"
      items={categories.map((category) => ({
        icon: (
          <CategoryIcon
            annotatorStateHandler={props.annotatorStateHandler}
            category={category}
            iconSize={CATEGORY_ICON_SIZE}
          />
        ),
        text: settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings),
        value: category,
      }))}
      onChange={changeAnnotationCategory}
      width={CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH}
    />
  );

  function changeAnnotationCategory(newCategory: string) {
    const newAnnotations = fetchedAnnotationHandler.updateManyCategory(
      annotatorState.annotations,
      props.annotation.entityId,
      newCategory,
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    props.annotatorStateHandler.set(newAnnotatorState);
  }
}
