import React from 'react';
import { ThemeProvider } from 'pelta-design-system';
import { Router } from './pages';
import { AlertHandlerContextProvider } from './services/alert';

const App = () => (
  <ThemeProvider>
    <AlertHandlerContextProvider>
      <Router />
    </AlertHandlerContextProvider>
  </ThemeProvider>
);

export default App;
