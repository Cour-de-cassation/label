import { dataModelType } from "../../types";

export { settingsDataModel };

export type { settingsType };

type settingsType = {
  [category: string]:
    | { anonymizationTexts: string[]; color: string }
    | undefined;
};

// The settings are passed as a JSON string to parse
const settingsDataModel: dataModelType<{ json: string }> = {
  json: "string",
};
