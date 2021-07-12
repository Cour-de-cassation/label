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
import { ResetPassword } from './ResetPassword';
import { SpecialDocuments } from './SpecialDocuments';
import { SettingsDataFetcher } from './SettingsDataFetcher';
import { Statistics } from './Admin/Statistics';
import { defaultRoutes, routes } from './routes';

export { Router };

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <UnauthenticatedRoute path={routes.LOGIN.getPath()}>
          <Login />
        </UnauthenticatedRoute>
        <AuthenticatedRoute path={routes.RESET_PASSWORD.getPath()}>
          <ResetPassword />
        </AuthenticatedRoute>
        <AuthenticatedRoute path={routes.ADMIN.getPath()}>
          <AuthenticatedRoute path={routes.DOCUMENT.getPath()}>
            <SettingsDataFetcher>{({ settings }) => <DocumentInspector settings={settings} />}</SettingsDataFetcher>
          </AuthenticatedRoute>
          <AuthenticatedRoute path={routes.ADMIN_MAIN.getPath()}>
            <AdminInfosDataFetcher>
              {({ adminInfos, refetch, ressourceFilters }) => {
                const unreadProblemReportsCount = adminInfos.problemReportsWithDetails.filter(
                  ({ problemReport }) => !problemReport.hasBeenRead,
                ).length;
                return (
                  <>
                    <AuthenticatedRoute path={routes.STATISTICS.getPath()}>
                      <AdminPage
                        header={wordings.statisticsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                      >
                        <Statistics
                          ressourceFilter={ressourceFilters.aggregatedStatistics}
                          refetch={refetch.aggregatedStatistics}
                          aggregatedStatistics={adminInfos.aggregatedStatistics}
                          availableStatisticFilters={adminInfos.availableStatisticFilters}
                          users={adminInfos.usersWithDetails.map(({ user: { _id, name } }) => ({ _id, name }))}
                        />
                      </AdminPage>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path={routes.AGENTS.getPath()}>
                      <AdminPage
                        header={wordings.agentsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                      >
                        <Agents usersWithDetails={adminInfos.usersWithDetails} refetch={refetch.usersWithDetails} />
                      </AdminPage>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path={routes.PROBLEM_REPORTS.getPath()}>
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
                    <AuthenticatedRoute path={routes.TREATED_DOCUMENTS.getPath()}>
                      <AdminPage
                        header={wordings.treatedDocumentsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                      >
                        <TreatedDocuments
                          treatedDocuments={adminInfos.treatedDocuments}
                          refetch={refetch.treatedDocuments}
                        />
                      </AdminPage>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path={routes.UNTREATED_DOCUMENT.getPath()}>
                      <AdminPage
                        header={wordings.untreatedDocumentsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                      >
                        <UntreatedDocuments
                          users={adminInfos.usersWithDetails.map(({ user: { _id, name } }) => ({ _id, name }))}
                          untreatedDocuments={adminInfos.untreatedDocuments}
                          refetch={refetch.untreatedDocuments}
                        />
                      </AdminPage>
                    </AuthenticatedRoute>
                  </>
                );
              }}
            </AdminInfosDataFetcher>
          </AuthenticatedRoute>
        </AuthenticatedRoute>
        <Route path={routes.ANONYMIZED_DOCUMENT.getPath()}>
          <AnonymizedDocument />
        </Route>
        <AuthenticatedRoute path={routes.SPECIAL_DOCUMENTS.getPath()}>
          <SpecialDocuments />
        </AuthenticatedRoute>
        <AuthenticatedRoute path={routes.ANNOTATION.getPath()}>
          <SettingsDataFetcher>{({ settings }) => <Home settings={settings} />}</SettingsDataFetcher>
        </AuthenticatedRoute>
        <AuthenticatedRoute>
          <HomeRoute path={routes.DEFAULT.getPath()} />
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
            pathname: routes.LOGIN.getPath(),
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
  const passwordTimeValidityStatus = localStorage.userHandler.getPasswordTimeValidityStatus();
  if (passwordTimeValidityStatus === 'outdated') {
    return routes.RESET_PASSWORD.getPath();
  }
  const userRole = localStorage.userHandler.getRole();

  if (!userRole) {
    return routes.LOGIN.getPath();
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
            pathname: routes.DEFAULT.getPath(),
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
