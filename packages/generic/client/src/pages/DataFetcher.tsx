import React, { ReactElement } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { buildFetchComponent } from '../services/buildFetchComponent';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';

export { DataFetcher };

function DataFetcher<fetchedType, dataType>(props: {
  alwaysDisplayHeader?: boolean;
  buildComponentWithData: (returnedData: dataType) => ReactElement;
  dataAdapter: (fetchedData: fetchedType) => dataType;
  fetchInfos: Array<{ loading: boolean; error?: ApolloError; data: unknown }>;
}) {
  return buildFetchComponent({
    buildComponentWithData: props.buildComponentWithData,
    dataAdapter: props.dataAdapter,
    errorPage: <ErrorPage displayHeader={props.alwaysDisplayHeader} />,
    fetchInfos: props.fetchInfos,
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
