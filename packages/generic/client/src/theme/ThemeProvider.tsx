import React, { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { theme } from './theme';

export { ThemeProvider };

function ThemeProvider(props: { children: ReactNode }) {
  const style = buildStyle();
  return (
    <MuiThemeProvider theme={theme}>
      <div style={style}>{props.children}</div>
    </MuiThemeProvider>
  );
}

function buildStyle() {
  return {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  };
}
