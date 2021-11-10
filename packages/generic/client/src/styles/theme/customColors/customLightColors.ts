import { customColorsType } from './customColorsType';
import { primaryColors } from './primaryColors';

export { customLightColors };

const customLightColors: customColorsType = {
  alert: ['red', '500'],
  background: 'white',
  badge: {
    type1: { backgroundColor: 'black', color: ['grey', '100'] },
  },
  default: ['blueGrey', '200'],
  disabled: { background: ['blueGrey', '50'], color: 'white' },
  document: ['blueGrey', '50'],
  dropdown: {
    border: ['grey', '600'],
  },
  error: ['red', '500'],
  icon: 'black',
  line: { level1: 'black', level2: ['grey', '600'] },
  primary: primaryColors.lightMode,
  success: ['lightGreen', '500'],
  warning: ['orange', '500'],
};
