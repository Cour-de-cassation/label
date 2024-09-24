import React from 'react';
import { ThemeProvider } from 'pelta-design-system';
import { Router } from './pages';
import { AlertHandlerContextProvider } from './services/alert';
import { PopupHandlerContextProvider } from './services/popup';
import { UserProvider } from './contexts/user.context';

const App = () => (
  <ThemeProvider>
    <AlertHandlerContextProvider>
      <PopupHandlerContextProvider>
        <UserProvider>
          <Router />
        </UserProvider>
      </PopupHandlerContextProvider>
    </AlertHandlerContextProvider>
  </ThemeProvider>
);

export default App;
