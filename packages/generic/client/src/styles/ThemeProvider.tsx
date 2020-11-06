import React, { ReactNode, createContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { displayModeType, themes } from './theme';

export { ThemeProvider, DisplayModeContext };

const DisplayModeContext = createContext<{
  displayMode: displayModeType;
  setDisplayMode: (displayMode: displayModeType) => void;
}>({
  displayMode: 'dark',
  setDisplayMode: () => null,
});

function ThemeProvider(props: { children: ReactNode }) {
  const [displayMode, setDisplayMode] = useState<displayModeType>('dark');
  const theme = themes[displayMode]();
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
