import React, { useState } from 'react';
import { annotationType, fetchedDocumentType, settingsType, idModule, settingsModule } from '@label/core';
import { MainHeader } from '../../components';
import { apiCaller } from '../../api';
import { MonitoringEntriesHandlerContextProvider } from '../../services/monitoring';
import { DocumentSelector } from './DocumentSelector';
import { HomeDocumentAnnotator } from './HomeDocumentAnnotator';

export { DocumentSwitcher };

type documentStateType =
  | { kind: 'annotating'; choice: { document: fetchedDocumentType; annotations: annotationType[] } }
  | { kind: 'selecting' };

function DocumentSwitcher(props: {
  choices: Array<{ document: fetchedDocumentType; annotations: annotationType[] }>;
  fetchNewDocumentsForUser: () => void;
  settings: settingsType;
}) {
  const [documentState, setDocumentState] = useState<documentStateType>(computeInitialDocumentState());
  const styles = buildStyles();

  return <div style={styles.documentSwitcher}>{renderPage()}</div>;

  function renderPage() {
    switch (documentState.kind) {
      case 'annotating':
        const settingsForDocument = settingsModule.lib.computeFilteredSettings(
          props.settings,
          documentState.choice.document.decisionMetadata.categoriesToOmit,
        );
        return (
          <MonitoringEntriesHandlerContextProvider documentId={documentState.choice.document._id}>
            <HomeDocumentAnnotator
              settings={settingsForDocument}
              document={documentState.choice.document}
              annotations={documentState.choice.annotations}
              fetchNewDocumentsForUser={props.fetchNewDocumentsForUser}
            />
          </MonitoringEntriesHandlerContextProvider>
        );
      case 'selecting':
        return (
          <>
            <MainHeader />
            <DocumentSelector choices={props.choices} onSelectDocument={onSelectDocument} settings={props.settings} />
          </>
        );
    }
  }

  function buildStyles() {
    return {
      documentSwitcher: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      },
    } as const;
  }

  function computeInitialDocumentState(): documentStateType {
    const savedDocumentForUser = props.choices.find(({ document }) => document.status === 'saved');

    if (savedDocumentForUser) {
      return { kind: 'annotating', choice: savedDocumentForUser };
    } else {
      return { kind: 'selecting' };
    }
  }

  async function onSelectDocument(choice: { document: fetchedDocumentType; annotations: annotationType[] }) {
    try {
      await Promise.all(
        props.choices.map((currentChoice) => {
          if (!idModule.lib.equalId(currentChoice.document._id, choice.document._id)) {
            return apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
              documentId: currentChoice.document._id,
              status: 'free',
            });
          }
        }),
      );
      try {
        await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
          documentId: choice.document._id,
          status: 'saved',
        });
      } catch (error) {
        console.warn(error);
        return window.location.reload();
      }
      setDocumentState({ kind: 'annotating', choice });
    } catch (error) {
      console.warn(error);
    }
  }
}
