import React, { ReactElement } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { handleFetchedData } from '../api';
import { localStorage } from '../services/localStorage';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';

export { DataFetcher };

function DataFetcher<dataT>(props: {
  buildComponentWithData: (returnedData: dataT) => ReactElement;
  fetchInfo: { isLoaded: boolean; statusCode?: number; data?: dataT };
  showLoadingOnRefetch?: boolean;
}) {
  const fetchedData = handleFetchedData(props.fetchInfo, props.showLoadingOnRefetch);

  switch (fetchedData.kind) {
    case 'loading':
      return buildLoadingPage();
    case 'data':
      return props.buildComponentWithData(fetchedData.data);
    case 'error':
      switch (fetchedData.error) {
        case 'authentication':
          localStorage.bearerTokenHandler.remove();
          return buildLoginRedirectionPage();
        case 'unknown':
          return buildErrorPage();
      }
  }

  function buildErrorPage() {
    return <ErrorPage />;
  }

  function buildLoadingPage() {
    return <LoadingPage />;
  }

  function buildLoginRedirectionPage() {
    return (
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
    );
  }
}
