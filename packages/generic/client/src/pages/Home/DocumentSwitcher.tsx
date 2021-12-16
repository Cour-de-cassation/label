import React, { useState } from 'react';
import {
  annotationType,
  fetchedDocumentType,
  settingsType,
  idModule,
  settingsModule,
  documentModule,
  assignationType,
} from '@label/core';
import { MainHeader } from '../../components';
import { apiCaller } from '../../api';
import { buildAnnotationsCommitter } from '../../services/annotatorState';
import { MonitoringEntriesHandlerContextProvider } from '../../services/monitoring';
import { DocumentSelector } from './DocumentSelector';
import { HomeDocumentAnnotator } from './HomeDocumentAnnotator';

export { DocumentSwitcher };

type documentStateType =
  | {
      kind: 'annotating';
      choice: { document: fetchedDocumentType; annotations: annotationType[]; assignationId: assignationType['_id'] };
    }
  | { kind: 'selecting' };

function DocumentSwitcher(props: {
  choices: Array<{
    document: fetchedDocumentType;
    annotations: annotationType[];
    assignationId: assignationType['_id'];
  }>;
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
          documentState.choice.document.decisionMetadata.additionalTermsToAnnotate,
        );
        return (
          <MonitoringEntriesHandlerContextProvider documentId={documentState.choice.document._id}>
            <HomeDocumentAnnotator
              assignationId={documentState.choice.assignationId}
              committer={buildAnnotationsCommitter()}
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

  async function onSelectDocument(choice: {
    document: fetchedDocumentType;
    annotations: annotationType[];
    assignationId: assignationType['_id'];
  }) {
    try {
      await Promise.all(
        props.choices.map((currentChoice) => {
          if (!idModule.lib.equalId(currentChoice.document._id, choice.document._id)) {
            return apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
              documentId: currentChoice.document._id,
              status: 'free',
            });
          }
          return;
        }),
      );
      try {
        await apiCaller.post<'resetTreatmentLastUpdateDate'>('resetTreatmentLastUpdateDate', {
          assignationId: choice.assignationId,
        });

        const nextStatus = documentModule.lib.getNextStatus({
          status: choice.document.status,
          publicationCategory: choice.document.publicationCategory,
          route: choice.document.route,
        });
        const { data: updatedDocument } = await apiCaller.post<'updateDocumentStatus'>('updateDocumentStatus', {
          documentId: choice.document._id,
          status: nextStatus,
        });
        setDocumentState({
          kind: 'annotating',
          choice: { ...choice, document: { ...updatedDocument, _id: idModule.lib.buildId(updatedDocument._id) } },
        });
      } catch (error) {
        console.warn(error);
        return window.location.reload();
      }
    } catch (error) {
      console.warn(error);
    }
  }
}
