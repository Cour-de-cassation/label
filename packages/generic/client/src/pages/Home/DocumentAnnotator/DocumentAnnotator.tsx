import React, { ReactElement } from 'react';
import { documentType } from '@label/core';
import { useQuery } from '@apollo/client';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';
import { annotationsQueryType } from './graphql/annotations.types';
import { ANNOTATIONS_QUERY } from './graphql/annotations.query';

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
      <div>
        <AnnotationsPanel annotations={annotations} />
        <DocumentPanel document={props.document} />
      </div>
    );
  }
}
