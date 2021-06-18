import { categorySettingType, settingsType } from '../settingsType';

export { getCategories };

function getCategories(settings: settingsType, status: categorySettingType['status'][]) {
  return Object.keys(settings)
    .filter((category) => {
      const categorySetting = settings[category];
      return status.includes(categorySetting.status);
    })
    .sort((categoryA, categoryB) => {
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
