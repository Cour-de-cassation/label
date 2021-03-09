import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { localStorage } from '../services/localStorage';
import { Agents } from './Admin/Agents';
import { DocumentInspector } from './Admin/DocumentInspector';
import { Treatments } from './Admin/Treatments';
import { ProblemReports } from './Admin/ProblemReports';
import { Home } from './Home';
import { Login } from './Login';
import { SettingsDataFetcher } from './SettingsDataFetcher';

export { Router };

function Router() {
  return (
    <BrowserRouter>
      <Switch>
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
        <AuthenticatedRoute path="/annotation">
          <SettingsDataFetcher alwaysDisplayHeader>
            {({ settings }) => <Home settings={settings} />}
          </SettingsDataFetcher>
        </AuthenticatedRoute>
        <AuthenticatedRoute>
          <HomeRoute path="/" />
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

const HomeRoute: FunctionComponent<RouteProps> = ({ ...props }: RouteProps) => (
  <Route
    {...props}
    render={({ location }) => (
      <Redirect
        to={{
          pathname: getRedirectionRoute(),
          state: { from: location },
        }}
      />
    )}
  />
);

function getRedirectionRoute() {
  const userRole = localStorage.userHandler.getRole();

  switch (userRole) {
    case 'admin':
      return '/admin/treatments';
    case 'annotator':
      return '/annotation';
    default:
      return '/annotation';
  }
}

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
