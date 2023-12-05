import React, { useEffect } from 'react';
import {
  annotationType,
  fetchedDocumentType,
  documentModule,
  idModule,
  settingsModule,
  settingsType,
  assignationType,
  annotationReportType,
} from '@label/core';
import { Text } from 'pelta-design-system';
import { wordings } from '../../../wordings';
import { DocumentSelectorCard } from './DocumentSelectorCard';
import { useAlert } from '../../../services/alert';

export { DocumentSelector };

function DocumentSelector(props: {
  choices: Array<{
    annotations: annotationType[];
    document: fetchedDocumentType;
    assignationId: assignationType['_id'];
    checklist: annotationReportType['checklist'];
  }>;
  settings: settingsType;
  onSelectDocument: (choice: {
    document: fetchedDocumentType;
    annotations: annotationType[];
    assignationId: assignationType['_id'];
    checklist: annotationReportType['checklist'];
  }) => Promise<void>;
}) {
  const styles = buildStyles();

  const { displayAlert } = useAlert();

  let autoFreeDocumentsTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    const timeBeforeFreeingDocuments = documentModule.lib.getMinutesBeforeFreeingPendingDocuments() * 60 * 1000;
    autoFreeDocumentsTimeout = setTimeout(displayRefreshAlert, timeBeforeFreeingDocuments);
    return () => {
      autoFreeDocumentsTimeout && clearTimeout(autoFreeDocumentsTimeout);
    };
  }, []);

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
        {props.choices.map((choice) => {
          const settingsForDocument = settingsModule.lib.computeFilteredSettings(
            props.settings,
            choice.document.decisionMetadata.categoriesToOmit,
            choice.document.decisionMetadata.additionalTermsToAnnotate,
          );

          return (
            <DocumentSelectorCard
              key={idModule.lib.convertToString(choice.document._id)}
              choice={choice}
              onSelect={props.onSelectDocument}
              settings={settingsForDocument}
            />
          );
        })}
      </div>
    );
  }

  function displayRefreshAlert() {
    displayAlert({ text: wordings.business.errors.pendingDocumentsFreed, variant: 'alert', autoHide: false });
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
