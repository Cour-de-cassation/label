import { displayModeType, settingsType } from '../settingsType';

export { getAnnotationCategoryColor };

const DEFAULT_ANNOTATION_COLOR = ['grey', 700];

function getAnnotationCategoryColor(category: string, settings: settingsType, displayMode: displayModeType) {
  return settings[category]?.color[displayMode] || DEFAULT_ANNOTATION_COLOR;
}
