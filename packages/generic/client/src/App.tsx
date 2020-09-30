import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { client } from './services/apollo/client';
import { Login } from './pages/Login';
import { ResetPasswordRequest } from './pages/ResetPasswordRequest';
import { theme } from './theme';

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/reset-password-request">
            <ResetPasswordRequest />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
