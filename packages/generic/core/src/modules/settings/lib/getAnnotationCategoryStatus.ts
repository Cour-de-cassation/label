import { settingsType } from '../settingsType';

export { getAnnotationCategoryStatus };

function getAnnotationCategoryStatus(category: string, settings: settingsType) {
  return settings[category]?.status || 'hidden';
}
