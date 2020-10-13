import { annotationType, settingsType } from '@label/core';

export { getAnnotationCategoryColor };

const DEFAULT_ANNOTATION_COLOR = '#00FF00';

function getAnnotationCategoryColor(category: string, settings: settingsType) {
  const color = settings[category]?.color;

  if (color) {
    return color;
  } else {
    return DEFAULT_ANNOTATION_COLOR;
  }
}
