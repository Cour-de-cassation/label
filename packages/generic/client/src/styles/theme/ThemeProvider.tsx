import React, { ReactNode, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { buildMuiTheme } from './theme';
import { displayModeType, DisplayModeContext } from './displayMode';

export { ThemeProvider };

const DEFAULT_DISPLAY_MODE = 'dark';

function ThemeProvider(props: { children: ReactNode }) {
  const [displayMode, setDisplayMode] = useState<displayModeType>(DEFAULT_DISPLAY_MODE);
  const theme = buildMuiTheme(displayMode);
  const displayModeContext = { displayMode, setDisplayMode };
  const style = buildStyle();

  return (
    <DisplayModeContext.Provider value={displayModeContext}>
      <MuiThemeProvider theme={theme}>
        <div style={style}>{props.children}</div>
      </MuiThemeProvider>
    </DisplayModeContext.Provider>
  );

  function buildStyle() {
    return {
      height: '100vh',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    };
  }
}
