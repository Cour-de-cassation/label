import { categorySettingType, settingsType } from '../settingsType';

export { getCategories };

function getCategories(
  settings: settingsType,
  filter: { status: categorySettingType['status'][]; canBeAnnotatedBy: 'human' | 'NLP' },
) {
  return Object.keys(settings)
    .filter((category) => {
      const categorySetting = settings[category];
      return (
        filter.status.includes(categorySetting.status) &&
        (categorySetting.canBeAnnotatedBy === 'both' || categorySetting.canBeAnnotatedBy === filter.canBeAnnotatedBy)
      );
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
