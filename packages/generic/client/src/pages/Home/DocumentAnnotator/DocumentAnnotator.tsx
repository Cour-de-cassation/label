import React, { ReactElement } from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { buildAnonymizer, settingsModule } from '@label/core';
import { LayoutGrid } from '../../../components';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import {
  ANNOTATIONS_GRAPHQL_QUERY,
  annotationsGraphQLType,
  SETTINGS_GRAPHQL_QUERY,
  settingsGraphQLType,
  DOCUMENTS_GRAPHQL_QUERY,
  documentGraphQLType,
} from './graphql';

export { DocumentAnnotator };

function DocumentAnnotator(): ReactElement {
  const settingsFetchInfo = useQuery<settingsGraphQLType>(SETTINGS_GRAPHQL_QUERY);
  const documentFetchInfo = useQuery<documentGraphQLType>(DOCUMENTS_GRAPHQL_QUERY);
  const annotationFetchInfo = useQuery<annotationsGraphQLType>(ANNOTATIONS_GRAPHQL_QUERY, {
    skip: !documentFetchInfo.data?.documents[0]?._id,
    variables: { documentId: documentFetchInfo.data?.documents[0]?._id },
  });

  return renderContent();

  function renderContent() {
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
    const settings = settingsModule.lib.parseFromJson(settingsFetchInfo.data.settings.json);
    const { documents } = documentFetchInfo.data;

    const anonymizer = buildAnonymizer(settings);

    return (
      <LayoutGrid container>
        <LayoutGrid container item xs={4}>
          <AnnotationsPanel annotations={annotations} anonymizer={anonymizer} settings={settings} />
        </LayoutGrid>
        <LayoutGrid container item xs={8}>
          <DocumentPanel
            annotations={annotations}
            anonymizer={anonymizer}
            document={documents[0]}
            settings={settings}
          />
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
