import { createMuiTheme } from '@material-ui/core/styles';

export { darkTheme as theme };

const palette = {
  tealBlue: '#00737D',
  gray100: '#121212',
  gray200: '#242424',
  gray300: '#383838',
  gray400: '#8D8D8D',
  white: '#ffffff',
  black: '#000000',
};

const fontSizes = {
  small: 12,
  medium: 16,
};

const typography = {
  body1: { fontFamily: 'Montserrat', fontSize: fontSizes.medium },
  body2: { fontFamily: 'CourierNew', fontSize: fontSizes.medium },
  h1: { fontFamily: 'Montserrat-Bold', fontSize: fontSizes.medium },
  subtitle1: { fontFamily: 'Montserrat', fontSize: fontSizes.small, textDecoration: 'underline' },
};

const darkTheme = createMuiTheme({
  shape: { borderRadius: 25 },
  palette: {
    text: { primary: palette.white },
    primary: {
      main: palette.tealBlue,
    },
    common: { black: palette.black, white: palette.white },
    grey: {
      '100': palette.gray100,
      '200': palette.gray200,
      '300': palette.gray300,
      '400': palette.gray400,
    },
    background: {
      default: palette.gray100,
      paper: palette.gray300,
    },
  },
  typography,
});
