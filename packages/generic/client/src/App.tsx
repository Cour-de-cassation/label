import React from 'react';
import { Router } from './pages';
import { AlertHandlerContextProvider } from './services/alert';
import { ThemeProvider } from './styles';

const App = () => (
  <ThemeProvider>
    <AlertHandlerContextProvider>
      <Router />
    </AlertHandlerContextProvider>
  </ThemeProvider>
);

export default App;
