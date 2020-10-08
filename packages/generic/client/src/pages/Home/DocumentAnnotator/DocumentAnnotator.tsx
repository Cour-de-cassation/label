import React, { ReactElement } from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { LayoutGrid } from '../../../components';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import {
  ANNOTATIONS_GRAPHQL_QUERY,
  annotationsGraphQLType,
  DOCUMENTS_GRAPHQL_QUERY,
  documentGraphQLType,
} from './graphql';

export { DocumentAnnotator };

function DocumentAnnotator(): ReactElement {
  const documentFetchInfo = useQuery<documentGraphQLType>(DOCUMENTS_GRAPHQL_QUERY);
  const annotationFetchInfo = useQuery<annotationsGraphQLType>(ANNOTATIONS_GRAPHQL_QUERY, {
    skip: !documentFetchInfo.data?.documents[0]?._id,
    variables: { documentId: documentFetchInfo.data?.documents[0]?._id },
  });

  return renderContent();

  function renderContent() {
    if (isLoading([documentFetchInfo, annotationFetchInfo])) {
      return <div>Chargement...</div>;
    }
    if (isFailure([documentFetchInfo, annotationFetchInfo]) || !documentFetchInfo.data || !annotationFetchInfo.data) {
      return <div>Une erreur est survenue</div>;
    }
    const { documents } = documentFetchInfo.data;
    const { annotations } = annotationFetchInfo.data;
    return (
      <LayoutGrid container>
        <LayoutGrid container item xs={3}>
          <AnnotationsPanel annotations={annotations} />
        </LayoutGrid>
        <LayoutGrid container item xs={9}>
          <DocumentPanel document={documents[0]} />
        </LayoutGrid>
      </LayoutGrid>
    );
  }

  function isLoading(fetchInfos: Array<{ loading: boolean }>): boolean {
    return fetchInfos.reduce((loading: boolean, fetchInfo) => loading || fetchInfo.loading, false);
  }

  function isFailure(fetchInfos: Array<{ error?: ApolloError }>): boolean {
    return fetchInfos.reduce((error: boolean, fetchInfo) => error || !!fetchInfo.error, false);
  }
}
