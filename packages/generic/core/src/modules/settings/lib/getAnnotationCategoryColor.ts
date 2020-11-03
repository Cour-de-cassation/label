import { settingsType } from '../settingsType';

export { getAnnotationCategoryColor };

const DEFAULT_ANNOTATION_COLOR = '#00FF00';

function getAnnotationCategoryColor(category: string, settings: settingsType) {
  return settings[category]?.color || DEFAULT_ANNOTATION_COLOR;
}
