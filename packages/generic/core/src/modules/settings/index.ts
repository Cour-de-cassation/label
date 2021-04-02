import {
  buildSettings,
  parseFromJson,
  getAnnotationCategoryColor,
  getAnnotationCategoryIconName,
  getAnnotationCategoryText,
  getCategories,
} from './lib';
import {
  colorType,
  constantColorType,
  displayModeType,
  settingsModel,
  settingsType,
  shadeColorType,
  categoryIconNameType,
} from './settingsType';

export { settingsModule };

export type { colorType, constantColorType, displayModeType, settingsType, shadeColorType, categoryIconNameType };

const settingsModule = {
  model: settingsModel,
  lib: {
    buildSettings,
    parseFromJson,
    getAnnotationCategoryColor,
    getAnnotationCategoryIconName,
    getAnnotationCategoryText,
    getCategories,
  },
};
