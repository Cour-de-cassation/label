import { settingsType } from '../settingsType';

export { getCategories };

function getCategories(settings: settingsType) {
  return Object.keys(settings).sort((categoryA, categoryB) => {
    const orderA = settings[categoryA].order;
    const orderB = settings[categoryB].order;
    if (orderA === undefined) {
      return 1;
    }
    if (orderB === undefined) {
      return -1;
    }
    return orderA - orderB;
  });
}
