import { settingsType } from '../settingsType';

export { getAnnotationCategoryIconName };

const DEFAULT_ANNOTATION_ICON_NAME = 'person';

function getAnnotationCategoryIconName(category: string, settings: settingsType) {
  return settings[category]?.iconName || DEFAULT_ANNOTATION_ICON_NAME;
}
