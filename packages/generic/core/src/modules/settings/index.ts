import {
  buildSettings,
  parseFromJson,
  getAnnotationCategoryColor,
  getAnnotationCategoryIconName,
} from "./lib";
import {
  settingsDataModel,
  settingsType,
  categoryIconNameType,
} from "./settingsType";

export { settingsModule };

export type { settingsType, categoryIconNameType };

const settingsModule = {
  dataModel: settingsDataModel,
  lib: {
    buildSettings,
    parseFromJson,
    getAnnotationCategoryColor,
    getAnnotationCategoryIconName,
  },
};
