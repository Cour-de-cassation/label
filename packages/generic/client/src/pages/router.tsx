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
import { Statistics } from './Admin/Statistics';
import { defaultRoutes, routes } from './routes';

export { Router };

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <UnauthenticatedRoute path={routes.LOGIN}>
          <Login />
        </UnauthenticatedRoute>
        <AuthenticatedRoute path={routes.ADMIN}>
          <AdminInfosDataFetcher>
            {({ adminInfos, refetch }) => {
              const unreadProblemReportsCount = adminInfos.problemReportsWithDetails.filter(
                ({ problemReport }) => !problemReport.hasBeenRead,
              ).length;
              return (
                <>
                  <AuthenticatedRoute path={routes.STATISTICS}>
                    <AdminPage
                      header={wordings.statisticsPage.header}
                      unreadProblemReportsCount={unreadProblemReportsCount}
                    >
                      <Statistics aggregatedStatistics={adminInfos.aggregatedStatistics} />
                    </AdminPage>
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path={routes.AGENTS}>
                    <AdminPage
                      header={wordings.agentsPage.header}
                      unreadProblemReportsCount={unreadProblemReportsCount}
                    >
                      <Agents usersWithDetails={adminInfos.usersWithDetails} />
                    </AdminPage>
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path={routes.PROBLEM_REPORTS}>
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
                  <AuthenticatedRoute path={routes.TREATED_DOCUMENTS}>
                    <AdminPage
                      header={wordings.treatedDocumentsPage.header}
                      unreadProblemReportsCount={unreadProblemReportsCount}
                    >
                      <TreatedDocuments treatedDocuments={adminInfos.treatedDocuments} />
                    </AdminPage>
                  </AuthenticatedRoute>
                  <AuthenticatedRoute path={routes.UNTREATED_DOCUMENT}>
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
          <AuthenticatedRoute path={routes.DOCUMENT}>
            <SettingsDataFetcher>{({ settings }) => <DocumentInspector settings={settings} />}</SettingsDataFetcher>
          </AuthenticatedRoute>
        </AuthenticatedRoute>
        <Route path={routes.ANONYMIZED_DOCUMENT}>
          <AnonymizedDocument />
        </Route>
        <AuthenticatedRoute path={routes.SPECIAL_DOCUMENTS}>
          <SpecialDocuments />
        </AuthenticatedRoute>
        <AuthenticatedRoute path={routes.ANNOTATION}>
          <SettingsDataFetcher>{({ settings }) => <Home settings={settings} />}</SettingsDataFetcher>
        </AuthenticatedRoute>
        <AuthenticatedRoute>
          <HomeRoute path={routes.DEFAULT} />
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
            pathname: routes.LOGIN,
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

  if (!userRole) {
    return routes.LOGIN;
  }

  if (userRole === 'admin') {
    const adminView = localStorage.adminViewHandler.get();
    if (adminView) {
      return defaultRoutes[adminView];
    }
  }

  return defaultRoutes[userRole];
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
            pathname: routes.DEFAULT,
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
