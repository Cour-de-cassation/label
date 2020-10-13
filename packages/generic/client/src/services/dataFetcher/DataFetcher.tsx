import React from 'react';
import { ApolloError, useQuery } from '@apollo/client';
import {
  annotationsGraphQLType,
  ANNOTATIONS_GRAPHQL_QUERY,
  documentGraphQLType,
  DOCUMENTS_GRAPHQL_QUERY,
  settingsGraphQLType,
  SETTINGS_GRAPHQL_QUERY,
} from '../../pages/Home/DocumentAnnotator/graphql';

export { DataFetcher };

function DataFetcher(props: { children: any }) {
  const settingsFetchInfo = useQuery<settingsGraphQLType>(SETTINGS_GRAPHQL_QUERY);
  const documentFetchInfo = useQuery<documentGraphQLType>(DOCUMENTS_GRAPHQL_QUERY);
  const annotationFetchInfo = useQuery<annotationsGraphQLType>(ANNOTATIONS_GRAPHQL_QUERY, {
    skip: !documentFetchInfo.data?.documents[0]?._id,
    variables: { documentId: documentFetchInfo.data?.documents[0]?._id },
  });

  if (isLoading([annotationFetchInfo, settingsFetchInfo, documentFetchInfo])) {
    return <div>Chargement...</div>;
  }
  if (
    isFailure([annotationFetchInfo, settingsFetchInfo, documentFetchInfo]) ||
    !annotationFetchInfo.data ||
    !settingsFetchInfo.data ||
    !documentFetchInfo.data
  ) {
    return <div>Une erreur est survenue</div>;
  }
  const { annotations } = annotationFetchInfo.data;
  const { documents } = documentFetchInfo.data;
  return props.children({ settingsJson: settingsFetchInfo.data.settings.json, document: documents[0], annotations });

  function isLoading(fetchInfos: Array<{ loading: boolean }>): boolean {
    return fetchInfos.reduce((loading: boolean, fetchInfo) => loading || fetchInfo.loading, false);
  }

  function isFailure(fetchInfos: Array<{ error?: ApolloError }>): boolean {
    return fetchInfos.reduce((error: boolean, fetchInfo) => error || !!fetchInfo.error, false);
  }
}
