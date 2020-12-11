import React, { ReactNode, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { displayModeType } from '@label/core';
import { buildMuiTheme } from './buildMuiTheme';
import { localStorage } from '../../services/localStorage';
import { DisplayModeContext } from './displayMode';

export { ThemeProvider };

const DEFAULT_DISPLAY_MODE = 'darkMode';

function ThemeProvider(props: { children: ReactNode }) {
  const INITIAL_DISPLAY_MODE = localStorage.displayModeHandler.get() || DEFAULT_DISPLAY_MODE;
  const [displayMode, setDisplayMode] = useState<displayModeType>(INITIAL_DISPLAY_MODE);
  const theme = buildMuiTheme(displayMode);
  const displayModeContext = { displayMode, setDisplayMode: setAndStoreDisplayMode };
  const style = buildStyle();

  return (
    <DisplayModeContext.Provider value={displayModeContext}>
      <MuiThemeProvider theme={theme}>
        <div style={style}>{props.children}</div>
      </MuiThemeProvider>
    </DisplayModeContext.Provider>
  );

  function setAndStoreDisplayMode(displayMode: displayModeType) {
    localStorage.displayModeHandler.set(displayMode);
    setDisplayMode(displayMode);
  }

  function buildStyle() {
    return {
      height: '100vh',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    };
  }
}
