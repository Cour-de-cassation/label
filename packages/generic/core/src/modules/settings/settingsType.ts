import { dataModelType } from '../dataModelType';

export { categoryIconNames, constantColors, settingsDataModel, shadeColors };

export type {
  categoryIconNameType,
  categorySettingType,
  colorType,
  constantColorType,
  displayModeType,
  settingsType,
  shadeColorType,
};

type settingsType = {
  [category: string]: categorySettingType;
};

type categorySettingType = {
  anonymizationTexts: string[];
  color: { [displayMode in displayModeType]: colorType };
  iconName: categoryIconNameType;
  text: string;
};

type displayModeType = 'lightMode' | 'darkMode';

const categoryIconNames = [
  'bank',
  'book',
  'car',
  'child',
  'cloud',
  'hammer',
  'heart',
  'location',
  'map',
  'person',
  'phone',
  'stroller',
  'work',
] as const;

type categoryIconNameType = typeof categoryIconNames[number];

const constantColors = ['black', 'white'] as const;

const shadeColors = [
  'blue',
  'blueGrey',
  'brown',
  'cyan',
  'deepOrange',
  'deepPurple',
  'green',
  'grey',
  'indigo',
  'lightBlue',
  'lime',
  'orange',
  'pink',
  'red',
  'teal',
  'yellow',
] as const;

type constantColorType = typeof constantColors[number];

type shadeColorType = [typeof shadeColors[number], number];

type colorType = constantColorType | shadeColorType;

// The settings are passed as a JSON string to parse
const settingsDataModel = {
  json: { type: 'string', graphQL: true },
} as const;

// We need this line for type checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typeCheck: dataModelType = settingsDataModel;
