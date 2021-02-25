import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { localStorage } from '../services/localStorage';
import { Agents } from './Admin/Agents';
import { DocumentInspector } from './Admin/DocumentInspector';
import { Treatments } from './Admin/Treatments';
import { ProblemReports } from './Admin/ProblemReports';
import { Home } from './Home';
import { Login } from './Login';
import { ResetPassword } from './ResetPassword';
import { ResetPasswordRequest } from './ResetPasswordRequest';
import { SettingsDataFetcher } from './SettingsDataFetcher';

export { Router };

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <UnauthenticatedRoute path="/reset-password-request">
          <ResetPasswordRequest />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute path="/reset-password/:resetPasswordToken">
          <ResetPassword />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute path="/login">
          <Login />
        </UnauthenticatedRoute>
        <AuthenticatedRoute path="/admin/problem-reports">
          <ProblemReports />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/admin/treatments">
          <Treatments />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/admin/agents">
          <Agents />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/admin/document/:documentId">
          <SettingsDataFetcher alwaysDisplayHeader>
            {({ settings }) => <DocumentInspector settings={settings} />}
          </SettingsDataFetcher>
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/">
          <SettingsDataFetcher alwaysDisplayHeader>
            {({ settings }) => <Home settings={settings} />}
          </SettingsDataFetcher>
        </AuthenticatedRoute>
      </Switch>
    </BrowserRouter>
  );
}

const AuthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }: RouteProps) => (
  <Route
    {...rest}
    render={({ location }) =>
      isAuthenticated() ? (
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

const UnauthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }: RouteProps) => (
  <Route
    {...rest}
    render={({ location }) =>
      !isAuthenticated() ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: location },
          }}
        />
      )
    }
  />
);

function isAuthenticated() {
  return !!localStorage.bearerTokenHandler.get();
}
