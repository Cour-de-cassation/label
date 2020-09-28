import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Home } from './pages/Home';
import { client } from './services/apollo/client';
import { Login } from './pages/Login';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  </ApolloProvider>
);

export default App;
