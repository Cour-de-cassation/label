import React from 'react';
import { annotationType, fetchedDocumentType, settingsType } from '@label/core';
import { DocumentSelectorCard } from './DocumentSelectorCard';

export { DocumentSelector };

function DocumentSelector(props: {
  choices: Array<{ annotations: annotationType[]; document: fetchedDocumentType }>;
  settings: settingsType;
  onSelectDocument: (choice: { document: fetchedDocumentType; annotations: annotationType[] }) => Promise<void>;
}) {
  const styles = buildStyles();
  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        {props.choices.map((choice) => (
          <DocumentSelectorCard choice={choice} onSelect={props.onSelectDocument} settings={props.settings} />
        ))}
      </div>
    </div>
  );
}

function buildStyles() {
  return {
    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },
    cardsContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
    },
  } as const;
}
