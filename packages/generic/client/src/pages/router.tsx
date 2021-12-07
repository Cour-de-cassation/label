import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { localStorage } from '../services/localStorage';
import { wordings } from '../wordings';
import { AdminPage } from './Admin/AdminPage';
import { AdminInfosDataFetcher } from './Admin/AdminInfosDataFetcher';
import { WorkingUsers } from './Admin/WorkingUsers';
import { DocumentInspector } from './Admin/DocumentInspector';
import { TreatedDocuments } from './Admin/TreatedDocuments';
import { ProblemReports } from './Admin/ProblemReports';
import { UntreatedDocuments } from './Admin/UntreatedDocuments';
import { AnonymizedDocument } from './AnonymizedDocument';
import { Home } from './Home';
import { Login } from './Login';
import { ResetPassword } from './ResetPassword';
import { PublishableDocuments } from './PublishableDocuments';
import { SettingsDataFetcher } from './SettingsDataFetcher';
import { Statistics } from './Admin/Statistics';
import { defaultRoutes, routes } from './routes';
import { ToBeConfirmedDocuments } from './Admin/ToBeConfirmedDocuments';

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
              {({ adminInfos, refetch, ressourceFilters, isLoading }) => {
                const unreadProblemReportsCount = adminInfos.problemReportsWithDetails.filter(
                  ({ problemReport }) => !problemReport.hasBeenRead,
                ).length;
                const toBeConfirmedDocumentsCount = adminInfos.toBeConfirmedDocuments.length;
                const userRole = localStorage.userHandler.getRole();
                if (userRole !== 'admin' && userRole !== 'scrutator') {
                  return <></>;
                }
                return (
                  <>
                    <AuthenticatedRoute path={routes.STATISTICS.getPath()}>
                      <AdminPage
                        userRole={userRole}
                        header={wordings.statisticsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                        toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                      >
                        <Statistics
                          ressourceFilter={ressourceFilters.aggregatedStatistics}
                          refetch={refetch.aggregatedStatistics}
                          isLoading={isLoading.aggregatedStatistics}
                          aggregatedStatistics={adminInfos.aggregatedStatistics}
                          availableStatisticFilters={adminInfos.availableStatisticFilters}
                          users={adminInfos.workingUsers.map(({ _id, name }) => ({ _id, name }))}
                        />
                      </AdminPage>
                    </AuthenticatedRoute>
                    {userRole === 'admin' && (
                      <AuthenticatedRoute path={routes.WORKING_USERS.getPath()}>
                        <AdminPage
                          userRole="admin"
                          header={wordings.workingUsersPage.header}
                          unreadProblemReportsCount={unreadProblemReportsCount}
                          toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                        >
                          <WorkingUsers workingUsers={adminInfos.workingUsers} refetch={refetch.workingUsers} />
                        </AdminPage>
                      </AuthenticatedRoute>
                    )}
                    <AuthenticatedRoute path={routes.PROBLEM_REPORTS.getPath()}>
                      <AdminPage
                        userRole={userRole}
                        header={wordings.problemReportsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                        toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                      >
                        <ProblemReports
                          refetch={refetch.problemReportsWithDetails}
                          problemReportsWithDetails={adminInfos.problemReportsWithDetails}
                          isLoading={isLoading.problemReports}
                        />
                      </AdminPage>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path={routes.TO_BE_CONFIRMED_DOCUMENTS.getPath()}>
                      <AdminPage
                        userRole={userRole}
                        header={wordings.toBeConfirmedDocumentsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                        toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                      >
                        <ToBeConfirmedDocuments
                          users={adminInfos.workingUsers.map(({ _id, name }) => ({ _id, name }))}
                          toBeConfirmedDocuments={adminInfos.toBeConfirmedDocuments}
                          refetch={refetch.toBeConfirmedDocuments}
                          isLoading={isLoading.toBeConfirmedDocuments}
                        />
                      </AdminPage>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path={routes.TREATED_DOCUMENTS.getPath()}>
                      <AdminPage
                        userRole={userRole}
                        header={wordings.treatedDocumentsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                        toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                      >
                        <TreatedDocuments
                          treatedDocuments={adminInfos.treatedDocuments}
                          refetch={refetch.treatedDocuments}
                          isLoading={isLoading.treatedDocuments}
                        />
                      </AdminPage>
                    </AuthenticatedRoute>
                    <AuthenticatedRoute path={routes.UNTREATED_DOCUMENT.getPath()}>
                      <AdminPage
                        userRole={userRole}
                        header={wordings.untreatedDocumentsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                        toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                      >
                        <UntreatedDocuments
                          users={adminInfos.workingUsers.map(({ _id, name }) => ({ _id, name }))}
                          untreatedDocuments={adminInfos.untreatedDocuments}
                          refetch={refetch.untreatedDocuments}
                          isLoading={isLoading.untreatedDocuments}
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
        <AuthenticatedRoute path={routes.PUBLISHABLE_DOCUMENTS.getPath()}>
          <PublishableDocuments />
        </AuthenticatedRoute>
        <AuthenticatedRoute path={routes.ANNOTATION.getPath()}>
          <SettingsDataFetcher>{({ settings }) => <Home settings={settings} />}</SettingsDataFetcher>
        </AuthenticatedRoute>
        <AuthenticatedRoute path={routes.DEFAULT.getPath()}>
          <HomeRoute />
        </AuthenticatedRoute>
        <Redirect path="/" to={{ pathname: routes.DEFAULT.getPath() }} />
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
  return !!localStorage.bearerTokenHandler.get() && !!localStorage.userHandler.getRole();
}
