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
import { PublishableDocuments } from './PublishableDocuments';
import { SettingsDataFetcher } from './SettingsDataFetcher';
import { Statistics } from './Admin/Statistics';
import { defaultRoutes, routes } from './routes';
import { ToBeConfirmedDocuments } from './Admin/ToBeConfirmedDocuments';
import { Summary } from './Admin/Summary';
import { urlHandler } from "../utils";

export { Router };

function Router() {
  return (
    <BrowserRouter>
      <Switch>
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
                const userRole = localStorage.adminViewHandler.get() || localStorage.userHandler.getRole();
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


function isAuthenticated() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { _id, email, name, role } = buildCookies();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  localStorage.userHandler.set({ _id, email, name, role });
  return !!localStorage.userHandler.getRole();
}

async function whoami(): Promise<boolean> {
  try {
    const response = await fetch(`${urlHandler.getApiUrl()}/label/api/sso/whoami`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { _id, email, name, role } = data || buildCookies();

    // Store user information in localStorage
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    localStorage.userHandler.set({ _id, email, name, role });
    return !!localStorage.userHandler.getRole();
  } catch (error) {
    console.error('Error fetching authentication status:', error);
    // Return false in case of any error
    return false;
  }
}

function getCookieByName(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let cookie: string = null;
  if (parts.length === 2) {
    // eslint-disable-next-line prefer-const,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line prefer-const
    cookie = parts.pop().split(';').shift();
  }
  return cookie;
}

function buildCookies() {
  const cookies: Array<{
    key: string;
    value: string;
  }> = [];
  const BEARER_TOKEN = 'BEARER_TOKEN';
  const USER_ID = 'USER_ID';
  const USER_EMAIL = 'USER_EMAIL';
  const USER_NAME = 'USER_NAME';
  const USER_ROLE = 'USER_ROLE';
  [BEARER_TOKEN, USER_ID, USER_EMAIL, USER_NAME, USER_ROLE].forEach((item) =>
    cookies.push({
      key: item,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value: getCookieByName(item),
    }),
  );
  let _id: any, email: any, name: any, role: any;
  cookies.forEach((cookie) => {
    if (cookie.value) {
      switch (cookie.key) {
        case BEARER_TOKEN:
          localStorage.bearerTokenHandler.set(cookie.value);
          break;
        case USER_ID:
          _id = cookie.value;
          break;
        case USER_EMAIL:
          email = decodeURIComponent(cookie.value);
          break;
        case USER_NAME:
          name = decodeURIComponent(cookie.value);
          break;
        case USER_ROLE:
          role = decodeURIComponent(cookie.value);
          break;
      }
    }
  });
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    _id,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    email,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    name,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    role,
  };
}
