import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { localStorage } from '../services/localStorage';
import { wordings } from '../wordings';
import { AdminPage } from './Admin/AdminPage';
import { AdminInfosDataFetcher } from './Admin/AdminInfosDataFetcher';
import { DocumentInspector } from './Admin/DocumentInspector';
import { TreatedDocuments } from './Admin/TreatedDocuments';
import { ProblemReports } from './Admin/ProblemReports';
import { PreAssignDocuments } from './Admin/PreAssignDocuments';
import { UntreatedDocuments } from './Admin/UntreatedDocuments';
import { AnonymizedDocument } from './AnonymizedDocument';
import { Home } from './Home';
import { Login } from './Login';
import { PublishableDocuments } from './PublishableDocuments';
import { SettingsDataFetcher } from './SettingsDataFetcher';
import { Statistics } from './Admin/Statistics';
import { defaultRoutes, routes } from './routes';
import { ToBeConfirmedDocuments } from './Admin/ToBeConfirmedDocuments';
import { Summary } from './Admin/Summary';
import { CurrentUser, useCtxUser } from '../contexts/user.context';

export { Router };

function Router() {
  const { user } = useCtxUser();
  return (
    <BrowserRouter>
      <Switch>
        <UnauthenticatedRoute path={routes.LOGIN.getPath()}>
          <Login />
        </UnauthenticatedRoute>
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
                const userRole = localStorage.adminViewHandler.get() || user?.role;
                if (userRole !== 'admin' && userRole !== 'scrutator') {
                  return <></>;
                }
                return (
                  <>
                    <AuthenticatedRoute path={routes.SUMMARY.getPath()}>
                      <AdminPage
                        userRole={userRole}
                        header={wordings.summaryPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                        toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                      >
                        <Summary refetch={refetch.summary} isLoading={isLoading.summary} summary={adminInfos.summary} />
                      </AdminPage>
                    </AuthenticatedRoute>
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
                    <AuthenticatedRoute path={routes.PRE_ASSIGN_DOCUMENTS.getPath()}>
                      <AdminPage
                        userRole={userRole}
                        header={wordings.preAssignDocumentsPage.header}
                        unreadProblemReportsCount={unreadProblemReportsCount}
                        toBeConfirmedDocumentsCount={toBeConfirmedDocumentsCount}
                      >
                        <PreAssignDocuments
                          users={adminInfos.workingUsers.map(({ _id, name }) => ({ _id, name }))}
                          refetch={refetch.preAssignDocuments}
                          preAssignations={adminInfos.preAssignations}
                          isLoading={isLoading.preAssignDocuments}
                          userRole={userRole}
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

const AuthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }: RouteProps) => {
  const { user, loading } = useCtxUser();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
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
};

const HomeRoute: FunctionComponent<RouteProps> = ({ ...props }: RouteProps) => {
  const { user, loading } = useCtxUser();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Route
      {...props}
      render={({ location }) => (
        <Redirect
          to={{
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            pathname: getRedirectionRoute(user),
            state: { from: location },
          }}
        />
      )}
    />
  );
};

function getRedirectionRoute(user: CurrentUser | null) {
  const userRole = user?.role;

  if (!userRole) {
    return routes.LOGIN.getPath();
  }

  if (userRole === 'admin') {
    const adminView = localStorage.adminViewHandler.get();
    if (adminView) {
      return defaultRoutes[adminView];
    }
  }

  return defaultRoutes[userRole as 'annotator' | 'scrutator' | 'admin'];
}

const UnauthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }: RouteProps) => {
  const { user, loading } = useCtxUser();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !user ? (
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
};
