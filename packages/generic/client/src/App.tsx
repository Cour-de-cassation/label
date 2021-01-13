import React from 'react';
import { Router } from './pages';
import { ThemeProvider } from './styles';

const App = () => (
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);

export default App;
