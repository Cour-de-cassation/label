import React from 'react';
import { ThemeProvider } from 'pelta-design-system';
import { Router } from './pages';
import { AlertHandlerContextProvider } from './services/alert';
import { PopupHandlerContextProvider } from './services/popup';

const App = () => (
  <ThemeProvider>
    <AlertHandlerContextProvider>
      <PopupHandlerContextProvider>
        <Router />
      </PopupHandlerContextProvider>
    </AlertHandlerContextProvider>
  </ThemeProvider>
);

export default App;
