import { customColorsType } from './customColorsType';

export { customDarkColors };

const customDarkColors: customColorsType = {
  alert: ['red', 500],
  background: ['grey', 900],
  default: ['grey', 800],
  disabled: { background: ['grey', 900], color: ['grey', 500] },
  document: 'black',
  dropdown: {
    border: ['grey', 600],
  },
  error: ['red', 500],
  icon: 'white',
  line: { level1: 'white', level2: ['grey', 600] },
  primary: ['cyan', 800],
  success: ['lightGreen', 500],
  warning: ['orange', 500],
};
