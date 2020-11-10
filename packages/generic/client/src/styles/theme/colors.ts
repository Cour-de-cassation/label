export { palette, customColors };

export type { colorsType };

const palette = {
  brightSun: '#FFD835',
  orange: '#FF6105',
  gray100: '#121212',
  gray200: '#242424',
  gray300: '#383838',
  gray400: '#8D8D8D',
  gray500: '#9E9E9E',
  grayBlue: '#ECEFF1',
  steelBlue: '#78909C',
  white: '#ffffff',
  black: '#000000',
};

const customDarkColors = {
  primary: palette.brightSun,
  secondary: palette.orange,
  background: {
    default: palette.gray200,
    highlight: palette.gray300,
  },
  text: {
    default: palette.white,
    disabled: palette.gray500,
  },
  button: {
    default: {
      background: palette.gray300,
    },
    disabled: {
      background: palette.gray200,
      color: palette.gray500,
    },
  },
  dropdown: {
    border: palette.white,
  },
  separator: palette.gray500,
  icon: palette.white,
  document: {
    background: palette.black,
  },
};

type colorsType = typeof customDarkColors;

const customLightColors: colorsType = {
  primary: palette.brightSun,
  secondary: palette.orange,
  background: {
    default: palette.white,
    highlight: palette.grayBlue,
  },
  text: {
    default: palette.black,
    disabled: palette.gray500,
  },
  button: {
    default: {
      background: palette.steelBlue,
    },
    disabled: {
      background: palette.grayBlue,
      color: palette.white,
    },
  },
  dropdown: {
    border: palette.black,
  },
  separator: palette.gray500,
  icon: palette.white,
  document: {
    background: palette.grayBlue,
  },
};

const customColors = {
  light: customLightColors,
  dark: customDarkColors,
};
