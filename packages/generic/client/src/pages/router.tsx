import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { getBearerTokenFromLocalStorage } from '../services/localStorage';
import { Home } from './Home';
import { Login } from './Login';
import { ResetPassword } from './ResetPassword';
import { ResetPasswordRequest } from './ResetPasswordRequest';

export { Router };

const Router: FunctionComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/reset-password-request">
        <ResetPasswordRequest />
      </Route>
      <Route path="/reset-password/:resetPasswordToken">
        <ResetPassword />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <AuthenticatedRoute path="/">
        <Home />
      </AuthenticatedRoute>
    </Switch>
  </BrowserRouter>
);

const AuthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) =>
      !!getBearerTokenFromLocalStorage() ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      )
    }
  />
);
