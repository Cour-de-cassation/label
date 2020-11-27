import React, { CSSProperties } from 'react';
import { fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { DocumentSelectorCard } from './DocumentSelectorCard';

export { DocumentSelector };

function DocumentSelector(props: {
  annotations: fetchedAnnotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
  onSelectDocument: () => void;
}) {
  const styles = buildStyles();
  return (
    <div style={styles.cardsContainer}>
      <DocumentSelectorCard
        annotations={props.annotations}
        document={props.document}
        onSelect={props.onSelectDocument}
        settings={props.settings}
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
