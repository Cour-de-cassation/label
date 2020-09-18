import React from 'react';
import { ApolloProvider } from '@apollo/client';
// import { Home } from './pages/Home';
import { client } from './services/apollo/client';
import { Login } from './pages/Login';

const App = () => (
  <ApolloProvider client={client}>
    <Login />
  </ApolloProvider>
);

export default App;
