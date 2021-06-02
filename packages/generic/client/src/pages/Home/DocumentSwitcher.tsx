import React, { useState } from 'react';
import {
  buildAnonymizer,
  annotationType,
  fetchedDocumentType,
  settingsType,
  annotationsDiffType,
  idModule,
  documentType,
  documentModule,
  settingsModule,
} from '@label/core';
import { MainHeader, PublicationCategoryBadge, Text } from '../../components';
import { apiCaller } from '../../api';
import {
  AnnotatorStateHandlerContextProvider,
  buildAnnotationsCommitter,
  buildAutoSaver,
} from '../../services/annotatorState';
import { useMonitoring, MonitoringEntriesHandlerContextProvider } from '../../services/monitoring';
import { wordings } from '../../wordings';
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
  const { resetMonitoringEntries, sendMonitoringEntries } = useMonitoring();

  const styles = buildStyles();

  return <div style={styles.documentSwitcher}>{renderPage()}</div>;

  function renderPage() {
    switch (documentState.kind) {
      case 'annotating':
        const subtitle = documentModule.lib.publicationHandler.mustBePublished(
          documentState.choice.document.publicationCategory,
        ) ? (
          <div style={styles.documentHeaderSubtitle}>
            <PublicationCategoryBadge
              publicationCategoryLetter={documentState.choice.document.publicationCategory[0]}
            />
            <Text>{wordings.homePage.publishedDocument}</Text>
          </div>
        ) : undefined;
        const settingsForDocument = settingsModule.lib.computeFilteredSettings(
          props.settings,
          documentState.choice.document.decisionMetadata.categoriesToOmit,
        );
        return (
          <MonitoringEntriesHandlerContextProvider documentId={documentState.choice.document._id}>
            <AnnotatorStateHandlerContextProvider
              autoSaver={buildAutoSaver({ applySave: applyAutoSave, documentId: documentState.choice.document._id })}
              buildAnonymizer={() => buildAnonymizer(props.settings)}
              committer={buildAnnotationsCommitter()}
              initialAnnotatorState={{
                annotations: documentState.choice.annotations,
                document: documentState.choice.document,
                settings: settingsForDocument,
              }}
            >
              <MainHeader title={documentState.choice.document.title} subtitle={subtitle} />
              <DocumentAnnotator
                onStopAnnotatingDocument={(status) =>
                  onStopAnnotatingDocument(documentState.choice.document._id, status)
                }
              />
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
      },
      documentHeaderSubtitle: {
        display: 'flex',
        alignItems: 'center',
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

  async function onStopAnnotatingDocument(documentId: documentType['_id'], status: documentType['status']) {
    await applyAutoSave(documentId, { before: [], after: [] });
    await sendMonitoringEntries();
    await setDocumentStatus(documentId, status);
    resetMonitoringEntries();
    props.fetchNewDocumentsForUser();
  }

  async function setDocumentStatus(documentId: documentType['_id'], status: documentType['status']) {
    try {
      await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
        documentId,
        status,
      });
      return;
    } catch (error) {
      console.warn(error);
    }
  }

  async function applyAutoSave(documentId: fetchedDocumentType['_id'], annotationsDiff: annotationsDiffType) {
    await apiCaller.post<'updateTreatment'>('updateTreatment', {
      annotationsDiff,
      documentId,
    });
    return;
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
