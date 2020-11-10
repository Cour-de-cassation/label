export { palette, customColors };

export type { colorsType };

const palette = {
  brightSun: '#FFD835',
  orange: '#FF6105',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey800: '#424242',
  grey900: '#212121',
  grayBlue: '#ECEFF1',
  steelBlue: '#78909C',
  white: '#ffffff',
  black: '#000000',
};

const customDarkColors = {
  primary: palette.brightSun,
  secondary: palette.orange,
  background: {
    default: palette.grey900,
    highlight: palette.grey800,
  },
  text: {
    default: palette.white,
    disabled: palette.grey500,
  },
  button: {
    default: {
      background: palette.grey800,
      hoveredBackground: palette.grey400,
    },
    disabled: {
      background: palette.grey900,
      color: palette.grey500,
    },
  },
  dropdown: {
    border: palette.white,
  },
  separator: palette.grey500,
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
    disabled: palette.grey500,
  },
  button: {
    default: {
      background: palette.steelBlue,
      hoveredBackground: palette.grey400,
    },
    disabled: {
      background: palette.grayBlue,
      color: palette.white,
    },
  },
  dropdown: {
    border: palette.black,
  },
  separator: palette.grey500,
  icon: palette.white,
  document: {
    background: palette.grayBlue,
  },
};

const customColors = {
  light: customLightColors,
  dark: customDarkColors,
};
