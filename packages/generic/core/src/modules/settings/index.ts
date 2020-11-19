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
  settingsDataModel,
  settingsType,
  shadeColorType,
  categoryIconNameType,
} from './settingsType';

export { settingsModule };

export type { colorType, constantColorType, displayModeType, settingsType, shadeColorType, categoryIconNameType };

const settingsModule = {
  dataModel: settingsDataModel,
  lib: {
    buildSettings,
    parseFromJson,
    getAnnotationCategoryColor,
    getAnnotationCategoryIconName,
    getAnnotationCategoryText,
    getCategories,
  },
};
