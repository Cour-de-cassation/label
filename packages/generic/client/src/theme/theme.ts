import { createMuiTheme } from '@material-ui/core/styles';

export { theme };

const palette = {
  red: '#FF0000',
};

const fontSizes = {
  small: 12,
  medium: 16,
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: palette.red,
    },
  },
  typography: {
    body1: { fontFamily: 'Montserrat', fontSize: fontSizes.medium },
    body2: { fontFamily: 'CourierNew', fontSize: fontSizes.medium },
    h1: { fontFamily: 'Montserrat-Bold', fontSize: fontSizes.medium },
    subtitle1: { fontFamily: 'Montserrat', fontSize: fontSizes.small, textDecoration: 'underline' },
  },
});
