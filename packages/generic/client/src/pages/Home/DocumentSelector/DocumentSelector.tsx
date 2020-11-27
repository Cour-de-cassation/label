import React, { CSSProperties } from 'react';
import { fetchedAnnotationType, fetchedDocumentType } from '@label/core';
import { DocumentSelectorCard } from './DocumentSelectorCard';

export { DocumentSelector };

function DocumentSelector(props: {
  annotations: fetchedAnnotationType[];
  document: fetchedDocumentType;
  onSelectDocument: () => void;
}) {
  const styles = buildStyles();
  return (
    <div style={styles.cardsContainer}>
      <DocumentSelectorCard
        onSelect={props.onSelectDocument}
        document={props.document}
        annotations={props.annotations}
      />
    </div>
  );
}

function buildStyles(): { [cssClass: string]: CSSProperties } {
  return {
    cardsContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-around',
      height: '100vh',
      alignItems: 'center',
    },
  };
}
