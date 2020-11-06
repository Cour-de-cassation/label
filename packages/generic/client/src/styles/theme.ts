import { merge } from 'lodash';
import { createMuiTheme } from '@material-ui/core';

export { themes };

export type { typographyType, displayModeType };

const palette = {
  brightSun: '#FFD835',
  orange: '#FF6105',
  gray100: '#000000',
  gray200: '#121212',
  gray300: '#242424',
  gray400: '#383838',
  gray500: '#8D8D8D',
  gray600: '#9E9E9E',
  grayBlue: '#ECEFF1',
  white: '#ffffff',
  black: '#000000',
};

const fontSizes = {
  small: 12,
  medium: 16,
  large: 24,
};

const typography = {
  body1: { fontFamily: 'Luciole', fontSize: fontSizes.medium },
  button: { fontFamily: 'Luciole', fontSize: fontSizes.medium },
  body2: { fontFamily: 'Courier New', fontSize: fontSizes.medium, lineHeight: '19px' },
  h1: { fontFamily: 'Luciole', fontSize: fontSizes.large },
  h2: { fontFamily: 'Luciole-Bold', fontSize: fontSizes.medium },
  subtitle1: { fontFamily: 'Luciole', fontSize: fontSizes.small, textDecoration: 'underline' },
};

type typographyType = keyof typeof typography;

type displayModeType = 'light' | 'dark';

const commonTheme = {
  shape: { borderRadius: 25 },
  spacing: 8,
  typography,
  palette: {
    primary: {
      main: palette.brightSun,
    },
    secondary: {
      main: palette.orange,
    },
    common: { black: palette.black, white: palette.white },
  },
};

const getDarkTheme = () =>
  createMuiTheme(
    buildTheme({
      palette: {
        text: { primary: palette.white, secondary: palette.gray500 },
        background: {
          default: palette.gray200,
          paper: palette.gray400,
        },
        action: {
          disabled: palette.gray400,
          disabledBackground: palette.gray300,
        },
        grey: {
          '100': palette.gray100,
          '200': palette.gray200,
          '300': palette.gray300,
          '400': palette.gray400,
          '500': palette.gray500,
        },
      },
    }),
  );

const getLightTheme = () =>
  createMuiTheme(
    buildTheme({
      palette: {
        text: { primary: palette.black, secondary: palette.gray500 },
        background: {
          default: palette.white,
          paper: palette.grayBlue,
        },
        action: {
          disabled: palette.white,
          disabledBackground: palette.grayBlue,
        },
        grey: {
          '100': palette.grayBlue,
          '200': palette.gray400,
          '300': palette.gray300,
          '400': palette.gray200,
          '500': '#ff0000',
        },
      },
    }),
  );

type customThemeType = {
  palette: {
    text: { primary: string; secondary: string };
    background: {
      default: string;
      paper: string;
    };
    action: {
      disabled: string;
      disabledBackground: string;
    };
    grey: {
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
    };
  };
};

function buildTheme(themeOptions: customThemeType) {
  return merge(commonTheme, themeOptions);
}

const themes = {
  light: getLightTheme,
  dark: getDarkTheme,
};
