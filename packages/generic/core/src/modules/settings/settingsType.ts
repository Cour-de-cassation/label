import { buildDataModelEntry } from '../dataModelType';

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
  anonymization: string;
  color: { [displayMode in displayModeType]: colorType };
  iconName: categoryIconNameType;
  order: number | undefined;
  text: string;
};

type displayModeType = 'lightMode' | 'darkMode';

const categoryIconNames = [
  'bank',
  'book',
  'cake',
  'car',
  'child',
  'city',
  'cloud',
  'email',
  'hammer',
  'heart',
  'location',
  'map',
  'pencil',
  'person',
  'phone',
  'store',
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
  'lightGreen',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
] as const;

type constantColorType = typeof constantColors[number];

type shadeColorType = [typeof shadeColors[number], number];

type colorType = constantColorType | shadeColorType;

// The settings are passed as a JSON string to parse
const settingsDataModel = {
  json: { type: buildDataModelEntry({ kind: 'primitive', content: 'string' }), network: true },
} as const;
