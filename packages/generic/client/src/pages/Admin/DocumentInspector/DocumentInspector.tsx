import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { buildAnonymizer, idModule, settingsType } from '@label/core';
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
          {({ annotations }) => (
            <MonitoringEntriesHandlerContextProvider documentId={idModule.lib.buildId(params.documentId)}>
              <AnnotatorStateHandlerContextProvider
                autoSaver={buildAutoSaver({ documentId: document._id })}
                buildAnonymizer={() => buildAnonymizer(props.settings)}
                committer={buildAnnotationsCommitter()}
                initialAnnotatorState={{
                  annotations: annotations,
                  document: document,
                  settings: props.settings,
                }}
              >
                <MainHeader title={document.title} onBackButtonPress={onBackButtonPress} />
                <DocumentAnnotator />
              </AnnotatorStateHandlerContextProvider>
            </MonitoringEntriesHandlerContextProvider>
          )}
        </AnnotationsDataFetcher>
      )}
    </DocumentDataFetcher>
  );

  function onBackButtonPress() {
    history.push('/admin/treatments');
  }
}
