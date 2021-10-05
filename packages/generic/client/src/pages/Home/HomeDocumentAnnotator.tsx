import React from 'react';
import {
  annotationsDiffType,
  annotationType,
  assignationType,
  documentModule,
  documentType,
  fetchedDocumentType,
  settingsType,
} from '@label/core';
import { apiCaller } from '../../api';
import { MainHeader, PublicationCategoryBadge, Text } from '../../components';
import {
  annotationsCommitterType,
  AnnotatorStateHandlerContextProvider,
  buildAutoSaver,
} from '../../services/annotatorState';
import { useMonitoring } from '../../services/monitoring';
import { useAlert } from '../../services/alert';
import { wordings } from '../../wordings';
import { DocumentAnnotator } from './DocumentAnnotator';
import { customThemeType, useCustomTheme } from '../../styles';

export { HomeDocumentAnnotator };

function HomeDocumentAnnotator(props: {
  annotations: annotationType[];
  assignationId: assignationType['_id'];
  committer: annotationsCommitterType;
  document: fetchedDocumentType;
  fetchNewDocumentsForUser: () => void;
  settings: settingsType;
}) {
  const { resetMonitoringEntries, sendMonitoringEntries } = useMonitoring();
  const { displayAlert } = useAlert();
  const theme = useCustomTheme();

  const styles = buildStyles(theme);
  const subtitle = documentModule.lib.publicationHandler.mustBePublished(props.document.publicationCategory) ? (
    <div style={styles.documentHeaderSubtitle}>
      {props.document.publicationCategory.map((publicationCategoryLetter) => (
        <div key={publicationCategoryLetter} style={styles.publicationCategoryLetter}>
          <PublicationCategoryBadge publicationCategoryLetter={publicationCategoryLetter} />
        </div>
      ))}
      <Text>{wordings.homePage.publishedDocument}</Text>
    </div>
  ) : undefined;
  return (
    <AnnotatorStateHandlerContextProvider
      autoSaver={buildAutoSaver({ applySave: applyAutoSave })}
      committer={props.committer}
      initialAnnotatorState={{
        assignationId: props.assignationId,
        annotations: props.annotations,
        document: props.document,
        settings: props.settings,
      }}
    >
      <MainHeader title={props.document.title} subtitle={subtitle} />
      <DocumentAnnotator
        onStopAnnotatingDocument={(status) =>
          onStopAnnotatingDocument({ assignationId: props.assignationId, documentId: props.document._id, status })
        }
      />
    </AnnotatorStateHandlerContextProvider>
  );

  async function onStopAnnotatingDocument({
    documentId,
    status,
    assignationId,
  }: {
    assignationId: assignationType['_id'];
    documentId: documentType['_id'];
    status: documentType['status'];
  }) {
    await apiCaller.post<'updateTreatmentDuration'>('updateTreatmentDuration', { assignationId });
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
      displayAlert({ variant: 'alert', text: wordings.business.errors.updateDocumentStatusFailed, autoHide: true });
      console.warn(error);
    }
  }

  async function applyAutoSave(annotationsDiff: annotationsDiffType) {
    try {
      await apiCaller.post<'updateTreatmentForAssignationId'>('updateTreatmentForAssignationId', {
        annotationsDiff,
        assignationId: props.assignationId,
      });
    } catch (error) {
      displayAlert({ variant: 'alert', text: wordings.business.errors.updateTreatmentFailed, autoHide: true });
      console.warn(error);
    }
  }
}

function buildStyles(theme: customThemeType) {
  return {
    documentHeaderSubtitle: {
      display: 'flex',
      alignItems: 'center',
    },
    publicationCategoryLetter: {
      marginRight: theme.spacing,
    },
  } as const;
}
