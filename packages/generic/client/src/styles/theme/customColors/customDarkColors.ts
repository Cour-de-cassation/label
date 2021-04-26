import { customColorsType } from './customColorsType';
import { primaryColors } from './primaryColors';

export { customDarkColors };

const customDarkColors: customColorsType = {
  alert: ['red', 500],
  background: ['grey', 900],
  badge: {
    type1: { backgroundColor: 'white', color: ['grey', 900] },
  },
  default: ['grey', 800],
  disabled: { background: ['grey', 900], color: ['grey', 500] },
  document: 'black',
  dropdown: {
    border: ['grey', 600],
  },
  error: ['red', 500],
  icon: 'white',
  line: { level1: 'white', level2: ['grey', 600] },
  primary: primaryColors.darkMode,
  success: ['lightGreen', 500],
  warning: ['orange', 500],
};
