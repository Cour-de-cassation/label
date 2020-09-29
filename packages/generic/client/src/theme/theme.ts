import { createMuiTheme } from '@material-ui/core/styles';

export { theme };

const palette = {
  red: '#FF0000',
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: palette.red,
    },
  },
});
