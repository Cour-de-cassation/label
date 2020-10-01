import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core';
import { client } from './services/apollo/client';
import { theme } from './theme';
import { Router } from './pages';

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
