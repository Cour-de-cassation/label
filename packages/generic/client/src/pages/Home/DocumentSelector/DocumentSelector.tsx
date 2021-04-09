import React from 'react';
import { annotationType, fetchedDocumentType, settingsType } from '@label/core';
import { Text } from '../../../components';
import { wordings } from '../../../wordings';
import { DocumentSelectorCard } from './DocumentSelectorCard';

export { DocumentSelector };

function DocumentSelector(props: {
  choices: Array<{ annotations: annotationType[]; document: fetchedDocumentType }>;
  settings: settingsType;
  onSelectDocument: (choice: { document: fetchedDocumentType; annotations: annotationType[] }) => Promise<void>;
}) {
  const styles = buildStyles();
  return <div style={styles.container}>{renderPage()}</div>;

  function renderPage() {
    if (props.choices.length === 0) {
      return (
        <div style={styles.emptyPageContainer}>
          <Text>{wordings.homePage.documentSelector.noDocumentLeft}</Text>
          <Text>{wordings.homePage.documentSelector.pleaseRefresh}</Text>
        </div>
      );
    }
    return (
      <div style={styles.cardsContainer}>
        {props.choices.map((choice) => (
          <DocumentSelectorCard choice={choice} onSelect={props.onSelectDocument} settings={props.settings} />
        ))}
      </div>
    );
  }
}

function buildStyles() {
  return {
    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },
    emptyPageContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
    },
    cardsContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
    },
  } as const;
}
