import { settingsType } from '../settingsType';

export { getAnnotationCategoryText };

function getAnnotationCategoryText(category: string, settings: settingsType) {
  return settings[category]?.text || category;
}
