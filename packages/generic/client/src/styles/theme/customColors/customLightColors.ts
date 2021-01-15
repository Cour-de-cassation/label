import { customColorsType } from './customColorsType';

export { customLightColors };

const customLightColors: customColorsType = {
  alert: ['red', 500],
  background: 'white',
  default: ['blueGrey', 200],
  disabled: { background: ['blueGrey', 50], color: 'white' },
  document: ['blueGrey', 50],
  dropdown: {
    border: 'black',
  },
  error: ['red', 500],
  icon: 'black',
  line: { level1: 'black', level2: ['grey', 600] },
  primary: ['cyan', 800],
  success: ['lightGreen', 500],
  warning: ['orange', 500],
};
