import { dataModelType } from '../dataModelType';

export { settingsDataModel };

export type { settingsType, categoryIconNameType, displayModeType };

type settingsType = {
  [category: string]:
    | {
        anonymizationTexts: string[];
        color: {
          lightMode: string;
          darkMode: string;
        };
        iconName: categoryIconNameType;
        text: string;
      }
    | undefined;
};

type displayModeType = 'lightMode' | 'darkMode';

type categoryIconNameType = 'person' | 'hammer' | 'map' | 'location' | 'work' | 'heart' | 'cloud' | 'stroller';

// The settings are passed as a JSON string to parse
const settingsDataModel = {
  json: { type: 'string', graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = settingsDataModel;
