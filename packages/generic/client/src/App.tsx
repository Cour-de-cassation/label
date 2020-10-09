import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo/client';
import { Router } from './pages';
import { ThemeProvider } from './theme';

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
