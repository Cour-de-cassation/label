import React, { useState } from 'react';
import {
  buildAnonymizer,
  annotationType,
  fetchedDocumentType,
  settingsType,
  annotationsDiffType,
  idModule,
} from '@label/core';
import { MainHeader } from '../../components';
import { apiCaller } from '../../api';
import {
  AnnotatorStateHandlerContextProvider,
  buildAnnotationsCommitter,
  buildAutoSaver,
} from '../../services/annotatorState';
import { useMonitoring, MonitoringEntriesHandlerContextProvider } from '../../services/monitoring';
import { DocumentAnnotator } from './DocumentAnnotator';
import { DocumentSelector } from './DocumentSelector';

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
  const { resetMonitoringEntries } = useMonitoring();
  const styles = buildStyles();

  return <div style={styles.documentSwitcher}>{renderPage()}</div>;

  function renderPage() {
    switch (documentState.kind) {
      case 'annotating':
        return (
          <MonitoringEntriesHandlerContextProvider documentId={documentState.choice.document._id}>
            <AnnotatorStateHandlerContextProvider
              autoSaver={buildAutoSaver({ applySave: applyAutoSave, documentId: documentState.choice.document._id })}
              buildAnonymizer={() => buildAnonymizer(props.settings)}
              committer={buildAnnotationsCommitter()}
              initialAnnotatorState={{
                annotations: documentState.choice.annotations,
                document: documentState.choice.document,
                settings: props.settings,
              }}
            >
              <MainHeader title={documentState.choice.document.title} />
              <DocumentAnnotator onStopAnnotatingDocument={onStopAnnotatingDocument} />
            </AnnotatorStateHandlerContextProvider>
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
      } as const,
    };
  }

  function computeInitialDocumentState(): documentStateType {
    const savedDocumentForUser = props.choices.find(({ document }) => document.status === 'saved');

    if (savedDocumentForUser) {
      return { kind: 'annotating', choice: savedDocumentForUser };
    } else {
      return { kind: 'selecting' };
    }
  }

  async function onStopAnnotatingDocument() {
    resetMonitoringEntries();
    props.fetchNewDocumentsForUser();
  }

  async function applyAutoSave(documentId: fetchedDocumentType['_id'], annotationsDiff: annotationsDiffType) {
    try {
      await apiCaller.post<'updateTreatment'>('updateTreatment', {
        annotationsDiff,
        documentId,
      });
    } catch (error) {
      console.warn(error);
    }
  }

  async function onSelectDocument(choice: { document: fetchedDocumentType; annotations: annotationType[] }) {
    try {
      await Promise.all(
        props.choices.map((currentChoice) => {
          if (idModule.lib.equalId(currentChoice.document._id, choice.document._id)) {
            return apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
              documentId: choice.document._id,
              status: 'saved',
            });
          }
          return apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
            documentId: currentChoice.document._id,
            status: 'free',
          });
        }),
      );
      setDocumentState({ kind: 'annotating', choice });
    } catch (error) {
      console.warn(error);
    }
  }
}
