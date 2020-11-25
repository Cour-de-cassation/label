import React from 'react';
import { fetchedAnnotationType, fetchedDocumentType } from '@label/core';
import { DocumentSelectorCard } from './DocumentSelectorCard';

export { DocumentSelector };

function DocumentSelector(props: {
  annotations: fetchedAnnotationType[];
  document: fetchedDocumentType;
  onSelectDocument: () => void;
}) {
  return (
    <div>
      <DocumentSelectorCard
        onSelect={props.onSelectDocument}
        document={props.document}
        annotations={props.annotations}
      />
    </div>
  );
}
