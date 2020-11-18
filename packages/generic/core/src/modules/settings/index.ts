import {
  buildSettings,
  parseFromJson,
  getAnnotationCategoryColor,
  getAnnotationCategoryIconName,
  getAnnotationCategoryText,
  getCategories,
} from './lib';
import { settingsDataModel, settingsType, categoryIconNameType, displayModeType } from './settingsType';

export { settingsModule };

export type { settingsType, categoryIconNameType, displayModeType };

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
