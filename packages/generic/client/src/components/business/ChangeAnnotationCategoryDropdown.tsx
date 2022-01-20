import React, { ReactElement } from 'react';
import { IconDropdown } from 'pelta-design-system';
import { annotationHandler, annotationType, settingsModule } from '@label/core';
import { useAnnotatorStateHandler } from '../../services/annotatorState';
import { useMonitoring } from '../../services/monitoring';
import { wordings } from '../../wordings';
import { CategoryIcon } from './CategoryIcon';

export { ChangeAnnotationCategoryDropdown };

const CATEGORY_ICON_SIZE = 30;
const CHANGE_ANNOTATION_CATEGORY_MENU_WIDTH = 300;

function ChangeAnnotationCategoryDropdown(props: {
  annotation: annotationType;
  buttonSize?: number;
  origin: 'document' | 'panel';
}): ReactElement {
  const annotatorStateHandler = useAnnotatorStateHandler();
  const { addMonitoringEntry } = useMonitoring();
  const annotatorState = annotatorStateHandler.get();
  const { settings } = annotatorState;
  const categories = settingsModule.lib.getCategories(settings, {
    status: ['annotable'],
    canBeAnnotatedBy: 'human',
  });

  return (
    <IconDropdown
      hint={wordings.homePage.changeCategory}
      iconName="puzzle"
      buttonSize={props.buttonSize}
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
      settings,
    );

    const newAnnotatorState = { ...annotatorState, annotations: newAnnotations };
    annotatorStateHandler.set(newAnnotatorState);
    addMonitoringEntry({
      action: `change_category_from_${props.annotation.category}_to_${newCategory}`,
      origin: props.origin,
    });
  }
}
