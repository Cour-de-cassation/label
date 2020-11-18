import {
  buildSettings,
  parseFromJson,
  getAnnotationCategoryColor,
  getAnnotationCategoryIconName,
  getAnnotationCategoryText,
  getCategories,
} from './lib';
import { settingsDataModel, settingsType, categoryIconNameType } from './settingsType';

export { settingsModule };

export type { settingsType, categoryIconNameType };

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
