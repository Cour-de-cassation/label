import { buildSettings, parseFromJson } from "./lib";
import { settingsDataModel, settingsType } from "./settingsType";

export { settingsModule };

export type { settingsType };

const settingsModule = {
  dataModel: settingsDataModel,
  lib: { buildSettings, parseFromJson },
};
