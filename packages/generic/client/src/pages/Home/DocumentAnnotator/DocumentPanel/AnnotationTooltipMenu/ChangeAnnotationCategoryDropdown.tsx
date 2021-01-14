import React, { ReactElement } from 'react';
import { annotationHandler, fetchedAnnotationType, settingsModule } from '@label/core';
import { CategoryIcon, IconDropdown } from '../../../../../components';
import { useAnnotatorStateHandler } from '../../../../../services/annotatorState';
import { useMonitoring } from '../../../../../services/monitoring';
import { wordings } from '../../../../../wordings';

export { ChangeAnnotationCategoryDropdown };

const CATEGORY_ICON_SIZE = 30;
const CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH = 300;

function ChangeAnnotationCategoryDropdown(props: { annotation: fetchedAnnotationType }): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { addMonitoringEntry } = useMonitoring();
  const annotatorState = annotatorStateHandler.get();
  const categories = settingsModule.lib.getCategories(annotatorState.settings);

  return (
    <IconDropdown
      hint={wordings.changeCategory}
      iconName="puzzle"
      items={categories.map((category) => ({
        icon: <CategoryIcon category={category} iconSize={CATEGORY_ICON_SIZE} settings={annotatorState.settings} />,
        text: settingsModule.lib.getAnnotationCategoryText(category, annotatorState.settings),
        value: category,
      }))}
      onChange={changeAnnotationCategory}
      width={CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH}
    />
  );

  function changeAnnotationCategory(newCategory: string) {
    const newAnnotations = annotationHandler.updateManyCategory(
      annotatorState.annotations,
      props.annotation.entityId,
      newCategory,
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    annotatorStateHandler.set(newAnnotatorState);
    addMonitoringEntry({
      description: `tooltip_change_category_from_${props.annotation.category}_to_${newCategory}`,
      type: 'button',
    });
  }
}
