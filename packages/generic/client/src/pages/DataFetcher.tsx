import React, { ReactElement } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { buildFetchComponent } from '../services/buildFetchComponent';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';

export { DataFetcher };

function DataFetcher<fetchedType, dataType>(props: {
  alwaysDisplayHeader?: boolean;
  dataAdapter: (fetchedData: fetchedType) => dataType;
  buildComponentWithData: (returnedData: dataType) => ReactElement;
  fetchInfo: { isLoaded: boolean; statusCode?: number; data?: fetchedType };
}) {
  return buildFetchComponent({
    buildComponentWithData: props.buildComponentWithData,
    dataAdapter: props.dataAdapter,
    errorPage: <ErrorPage displayHeader={props.alwaysDisplayHeader} />,
    fetchInfo: props.fetchInfo,
    loadingPage: <LoadingPage displayHeader={props.alwaysDisplayHeader} />,
    loginRedirect: (
      <Route
        render={({ location }) => (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )}
      />
    ),
  });
}
