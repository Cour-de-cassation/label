import { dataModelType } from "../../types";

export { settingsDataModel };

export type { settingsType, categoryIconNameType };

type settingsType = {
  [category: string]:
    | {
        anonymizationTexts: string[];
        color: string;
        iconName: categoryIconNameType;
        text: string;
      }
    | undefined;
};

type categoryIconNameType =
  | "person"
  | "building"
  | "house"
  | "work"
  | "contact";

// The settings are passed as a JSON string to parse
const settingsDataModel: dataModelType<{ json: string }> = {
  json: { type: "string", graphQL: true },
};
