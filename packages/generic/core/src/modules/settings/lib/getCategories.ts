import { settingsType } from '../settingsType';

export { getCategories };

function getCategories(settings: settingsType) {
  return Object.keys(settings);
}
