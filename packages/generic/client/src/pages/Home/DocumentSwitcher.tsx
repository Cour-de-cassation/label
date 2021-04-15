import React, { useState } from 'react';
import {
  buildAnonymizer,
  annotationType,
  fetchedDocumentType,
  settingsType,
  annotationsDiffType,
  idModule,
  documentType,
} from '@label/core';
import { MainHeader, PublicationCategoryBadge, Text } from '../../components';
import { apiCaller } from '../../api';
import {
  AnnotatorStateHandlerContextProvider,
  buildAnnotationsCommitter,
  buildAutoSaver,
} from '../../services/annotatorState';
import { useMonitoring, MonitoringEntriesHandlerContextProvider } from '../../services/monitoring';
import { customThemeType, useCustomTheme } from '../../styles';
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
  const theme = useCustomTheme();
  const styles = buildStyles(theme);

  return <div style={styles.documentSwitcher}>{renderPage()}</div>;

  function renderPage() {
    switch (documentState.kind) {
      case 'annotating':
        const subtitle = documentState.choice.document.publicationCategory.length ? (
          <div style={styles.documentHeaderSubtitle}>
            <div style={styles.publicationCategoryBadgeContainer}>
              <PublicationCategoryBadge
                publicationCategoryLetter={documentState.choice.document.publicationCategory[0]}
              />
            </div>
            <Text>{wordings.homePage.publishedDocument}</Text>
          </div>
        ) : undefined;
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
              <MainHeader title={documentState.choice.document.title} subtitle={subtitle} />
              <DocumentAnnotator
                onStopAnnotatingDocument={() => onStopAnnotatingDocument(documentState.choice.document._id)}
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

  function buildStyles(theme: customThemeType) {
    return {
      documentSwitcher: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      },
      documentHeaderSubtitle: {
        display: 'flex',
      },
      publicationCategoryBadgeContainer: {
        marginRight: theme.spacing,
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

  async function onStopAnnotatingDocument(documentId: documentType['_id']) {
    await applyAutoSave(documentId, { before: [], after: [] });
    await sendMonitoringEntries();
    await setDocumentStatusDone(documentId);
    resetMonitoringEntries();
    props.fetchNewDocumentsForUser();
  }

  async function setDocumentStatusDone(documentId: documentType['_id']) {
    try {
      await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
        documentId,
        status: 'done',
      });
      return;
    } catch (error) {
      console.warn(error);
    }
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
