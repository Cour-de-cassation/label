import { customColorsType } from './customColorsType';

export { customLightColors };

const customLightColors: customColorsType = {
  background: {
    default: 'white',
    highlight: ['blueGrey', 50],
  },
  button: {
    default: ['blueGrey', 400],
    disabled: {
      background: ['blueGrey', 50],
      color: 'white',
    },
  },
  document: {
    background: ['blueGrey', 50],
  },
  dropdown: {
    border: 'black',
  },
  icon: 'white',
  primary: ['yellow', 600],
  secondary: ['orange', 500],
  separator: ['grey', 500],
  text: {
    default: 'black',
    disabled: ['grey', 500],
  },
};
