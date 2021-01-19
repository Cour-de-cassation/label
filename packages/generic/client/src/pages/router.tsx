import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { localStorage } from '../services/localStorage';
import { Admin } from './Admin';
import { Agents } from './Admin/Agents';
import { Treatments } from './Admin/Treatments';
import { ProblemReports } from './Admin/ProblemReports';
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
      <AuthenticatedRoute path="/admin/problem-reports">
        <ProblemReports />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/admin/treatments">
        <Treatments />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/admin/agents">
        <Agents />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/admin">
        <Admin />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/">
        <Home />
      </AuthenticatedRoute>
    </Switch>
  </BrowserRouter>
);

const AuthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }: RouteProps) => (
  <Route
    {...rest}
    render={({ location }) =>
      !!localStorage.bearerTokenHandler.get() ? (
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
