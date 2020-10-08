import React, { ReactElement } from 'react';
import { documentType } from '@label/core';
import { useQuery } from '@apollo/client';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { annotationsQueryType } from './graphql/annotations.types';
import { ANNOTATIONS_QUERY } from './graphql/annotations.query';
import { LayoutGrid } from '../../../components';

export { DocumentAnnotator };

function DocumentAnnotator(props: { document: documentType }): ReactElement {
  const { data, loading, error } = useQuery<annotationsQueryType>(ANNOTATIONS_QUERY, {
    variables: { documentId: props.document._id },
  });
  return renderContent();

  function renderContent() {
    if (loading) {
      return <div>Chargement...</div>;
    }
    if (error || !data || data.annotations.length === 0) {
      return <div>Une erreur est survenue</div>;
    }
    const { annotations } = data;
    return (
      <LayoutGrid container>
        <LayoutGrid container item xs={3}>
          <AnnotationsPanel annotations={annotations} />
        </LayoutGrid>
        <LayoutGrid container item xs={9}>
          <DocumentPanel document={props.document} />
        </LayoutGrid>
      </LayoutGrid>
    );
  }
}
