import React from 'react';
import {
  annotationsDiffType,
  annotationType,
  buildAnonymizer,
  documentModule,
  documentType,
  fetchedDocumentType,
  settingsType,
} from '@label/core';
import { apiCaller } from '../../api';
import { MainHeader, PublicationCategoryBadge, Text } from '../../components';
import {
  AnnotatorStateHandlerContextProvider,
  buildAnnotationsCommitter,
  buildAutoSaver,
} from '../../services/annotatorState';
import { useMonitoring } from '../../services/monitoring';
import { useAlert } from '../../services/alert';
import { wordings } from '../../wordings';
import { DocumentAnnotator } from './DocumentAnnotator';

export { HomeDocumentAnnotator };
function HomeDocumentAnnotator(props: {
  annotations: annotationType[];
  document: fetchedDocumentType;
  fetchNewDocumentsForUser: () => void;
  settings: settingsType;
}) {
  const { resetMonitoringEntries, sendMonitoringEntries } = useMonitoring();
  const { displayAlert } = useAlert();

  const styles = buildStyles();
  const subtitle = documentModule.lib.publicationHandler.mustBePublished(props.document.publicationCategory) ? (
    <div style={styles.documentHeaderSubtitle}>
      <PublicationCategoryBadge publicationCategoryLetter={props.document.publicationCategory[0]} />
      <Text>{wordings.homePage.publishedDocument}</Text>
    </div>
  ) : undefined;
  return (
    <AnnotatorStateHandlerContextProvider
      autoSaver={buildAutoSaver({ applySave: applyAutoSave, documentId: props.document._id })}
      buildAnonymizer={() => buildAnonymizer(props.settings)}
      committer={buildAnnotationsCommitter()}
      initialAnnotatorState={{
        annotations: props.annotations,
        document: props.document,
        settings: props.settings,
      }}
    >
      <MainHeader title={props.document.title} subtitle={subtitle} />
      <DocumentAnnotator onStopAnnotatingDocument={(status) => onStopAnnotatingDocument(props.document._id, status)} />
    </AnnotatorStateHandlerContextProvider>
  );

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
    } catch (error) {
      displayAlert({ variant: 'alert', text: wordings.business.errors.updateDocumentStatusFailed });
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
      displayAlert({ variant: 'alert', text: wordings.business.errors.updateTreatmentFailed });
      console.warn(error);
    }
  }
}

function buildStyles() {
  return {
    documentHeaderSubtitle: {
      display: 'flex',
      alignItems: 'center',
    },
  } as const;
}
