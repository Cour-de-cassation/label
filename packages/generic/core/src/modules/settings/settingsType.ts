import { dataModelType } from '../dataModelType';

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
  | 'person'
  | 'building'
  | 'house'
  | 'work'
  | 'contact';

// The settings are passed as a JSON string to parse
const settingsDataModel = {
  json: { type: 'string', graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = settingsDataModel;
