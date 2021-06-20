import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  annotationsDiffType,
  buildAnonymizer,
  fetchedDocumentType,
  idModule,
  settingsModule,
  settingsType,
} from '@label/core';
import { apiCaller } from '../../../api';
import { MainHeader } from '../../../components';
import {
  AnnotatorStateHandlerContextProvider,
  buildAnnotationsCommitter,
  buildAutoSaver,
} from '../../../services/annotatorState';
import { MonitoringEntriesHandlerContextProvider } from '../../../services/monitoring';
import { DocumentAnnotator } from '../../Home/DocumentAnnotator';
import { AnnotationsDataFetcher } from './AnnotationsDataFetcher';
import { DocumentDataFetcher } from './DocumentDataFetcher';

export { DocumentInspector };

type DocumentInspectorParamsType = {
  documentId: string;
};

function DocumentInspector(props: { settings: settingsType }) {
  const params = useParams<DocumentInspectorParamsType>();
  const history = useHistory();

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
                  buildAnonymizer={() => buildAnonymizer(settingsForDocument)}
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

  async function applyAutoSave(documentId: fetchedDocumentType['_id'], annotationsDiff: annotationsDiffType) {
    await apiCaller.post<'updateTreatment'>('updateTreatment', {
      annotationsDiff,
      documentId,
    });
    return;
  }
}
