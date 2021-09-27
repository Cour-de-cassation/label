import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { annotationsDiffType, fetchedDocumentType, idModule, settingsModule, settingsType } from '@label/core';
import { apiCaller } from '../../../api';
import { MainHeader } from '../../../components';
import {
  AnnotatorStateHandlerContextProvider,
  buildAnnotationsCommitter,
  buildAutoSaver,
} from '../../../services/annotatorState';
import { MonitoringEntriesHandlerContextProvider } from '../../../services/monitoring';
import { DocumentAnnotator } from '../../Home/DocumentAnnotator';
import { useAlert } from '../../../services/alert';
import { wordings } from '../../../wordings';
import { AnnotationsDataFetcher } from './AnnotationsDataFetcher';
import { DocumentDataFetcher } from './DocumentDataFetcher';
import { localStorage } from '../../../services/localStorage';

export { DocumentInspector };

type DocumentInspectorParamsType = {
  documentId: string;
};

function DocumentInspector(props: { settings: settingsType }) {
  const params = useParams<DocumentInspectorParamsType>();
  const history = useHistory();
  const { displayAlert } = useAlert();

  useEffect(() => {
    const userRole = localStorage.userHandler.getRole();
    if (userRole === 'scrutator') {
      displayScrutatorInfo();
    }
  }, []);

  return (
    <DocumentDataFetcher documentId={params.documentId}>
      {({ document }) => (
        <AnnotationsDataFetcher documentId={params.documentId}>
          {({ annotations }) => {
            const settingsForDocument = settingsModule.lib.computeFilteredSettings(
              props.settings,
              document.decisionMetadata.categoriesToOmit,
              document.decisionMetadata.additionalTermsToAnnotate,
            );

            return (
              <MonitoringEntriesHandlerContextProvider documentId={idModule.lib.buildId(params.documentId)}>
                <AnnotatorStateHandlerContextProvider
                  autoSaver={buildAutoSaver({ applySave: applyAutoSave, documentId: document._id })}
                  committer={buildAnnotationsCommitter()}
                  initialAnnotatorState={{
                    annotations: annotations,
                    document: document,
                    settings: settingsForDocument,
                  }}
                >
                  <MainHeader title={document.title} onBackButtonPress={history.goBack} />
                  <DocumentAnnotator />
                </AnnotatorStateHandlerContextProvider>
              </MonitoringEntriesHandlerContextProvider>
            );
          }}
        </AnnotationsDataFetcher>
      )}
    </DocumentDataFetcher>
  );

  function displayScrutatorInfo() {
    displayAlert({ variant: 'info', text: wordings.homePage.scrutatorInfo, autoHide: true });
  }

  async function applyAutoSave(documentId: fetchedDocumentType['_id'], annotationsDiff: annotationsDiffType) {
    try {
      await apiCaller.post<'updateTreatment'>('updateTreatment', {
        annotationsDiff,
        documentId,
      });
    } catch (error) {
      displayAlert({ variant: 'alert', text: wordings.business.errors.updateTreatmentFailed, autoHide: true });
      console.warn(error);
    }
  }
}
