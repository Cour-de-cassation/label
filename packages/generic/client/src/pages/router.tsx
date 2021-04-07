import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { localStorage } from '../services/localStorage';
import { wordings } from '../wordings';
import { AdminPage } from './Admin/AdminPage';
import { AdminInfosDataFetcher } from './Admin/AdminInfosDataFetcher';
import { Agents } from './Admin/Agents';
import { DocumentInspector } from './Admin/DocumentInspector';
import { TreatedDocuments } from './Admin/TreatedDocuments';
import { ProblemReports } from './Admin/ProblemReports';
import { UntreatedDocuments } from './Admin/UntreatedDocuments';
import { AnonymizedDocument } from './AnonymizedDocument';
import { Home } from './Home';
import { Login } from './Login';
import { SpecialDocuments } from './SpecialDocuments';
import { SettingsDataFetcher } from './SettingsDataFetcher';

export { Router };

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <UnauthenticatedRoute path="/login">
          <Login />
        </UnauthenticatedRoute>
        <AuthenticatedRoute path="/admin">
          <AdminInfosDataFetcher>
            {({ adminInfos, refetch }) => {
              const unreadProblemReportsCount = adminInfos.problemReportsWithDetails.filter(
                ({ problemReport }) => !problemReport.hasBeenRead,
              ).length;
              return (
                <>
                  <AuthenticatedRoute path="/admin/agents">
                    <AdminPage
                      header={wordings.agentsPage.header}
                      unreadProblemReportsCount={unreadProblemReportsCount}
                    >
                      <Agents usersWithDetails={adminInfos.usersWithDetails} />
                    </AdminPage>
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path="/admin/problem-reports">
                    <AdminPage
                      header={wordings.problemReportsPage.header}
                      unreadProblemReportsCount={unreadProblemReportsCount}
                    >
                      <ProblemReports
                        refetch={refetch.problemReportsWithDetails}
                        problemReportsWithDetails={adminInfos.problemReportsWithDetails}
                      />
                    </AdminPage>
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path="/admin/treated-documents">
                    <AdminPage
                      header={wordings.treatedDocumentsPage.header}
                      unreadProblemReportsCount={unreadProblemReportsCount}
                    >
                      <TreatedDocuments treatedDocuments={adminInfos.treatedDocuments} />
                    </AdminPage>
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path="/admin/untreated-documents">
                    <AdminPage
                      header={wordings.untreatedDocumentsPage.header}
                      unreadProblemReportsCount={unreadProblemReportsCount}
                    >
                      <UntreatedDocuments untreatedDocuments={adminInfos.untreatedDocuments} />
                    </AdminPage>
                  </AuthenticatedRoute>
                </>
              );
            }}
          </AdminInfosDataFetcher>
          <AuthenticatedRoute path="/admin/document/:documentId">
            <SettingsDataFetcher>{({ settings }) => <DocumentInspector settings={settings} />}</SettingsDataFetcher>
          </AuthenticatedRoute>
        </AuthenticatedRoute>
        <Route path="/anonymized-document/:documentId">
          <AnonymizedDocument />
        </Route>
        <AuthenticatedRoute path="/special-documents">
          <SpecialDocuments />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/annotation">
          <SettingsDataFetcher>{({ settings }) => <Home settings={settings} />}</SettingsDataFetcher>
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
      return '/admin/treated-documents';
    case 'annotator':
      return '/annotation';
    case 'specialDocumentAnnotator':
      return '/special-documents';
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
