import React, { ReactElement } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { errorHandlers, httpStatusCodeHandler } from '@label/core';
import { localStorage } from '../services/localStorage';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';

export { DataFetcher };

function DataFetcher<dataT>(props: {
  alwaysDisplayHeader?: boolean;
  buildComponentWithData: (returnedData: dataT) => ReactElement;
  fetchInfo: { isLoaded: boolean; statusCode?: number; data?: dataT };
}) {
  if (!props.fetchInfo.isLoaded) {
    return buildLoadingPage();
  }

  if (props.fetchInfo.statusCode) {
    if (httpStatusCodeHandler.isSuccess(props.fetchInfo.statusCode) && props.fetchInfo.data) {
      return props.buildComponentWithData(props.fetchInfo.data);
    } else if (errorHandlers.authenticationErrorHandler.check(props.fetchInfo.statusCode)) {
      localStorage.bearerTokenHandler.remove();
      return buildLoginRedirectionPage();
    } else {
      return buildErrorPage();
    }
  }

  return buildErrorPage();

  function buildErrorPage() {
    return <ErrorPage displayHeader={props.alwaysDisplayHeader} />;
  }

  function buildLoadingPage() {
    return <LoadingPage displayHeader={props.alwaysDisplayHeader} />;
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
