import React from 'react';
import { useParams } from 'react-router-dom';
import { buildAnonymizer, idModule, settingsType } from '@label/core';
import { MainHeader } from '../../../components';
import { AnnotatorStateHandlerContextProvider, buildAnnotationsCommitter } from '../../../services/annotatorState';
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

  return (
    <DocumentDataFetcher documentId={params.documentId} alwaysDisplayHeader>
      {({ document }) => (
        <AnnotationsDataFetcher documentId={params.documentId}>
          {({ annotations }) => (
            <MonitoringEntriesHandlerContextProvider documentId={idModule.lib.buildId(params.documentId)}>
              <AnnotatorStateHandlerContextProvider
                initialAnnotatorState={{
                  annotations: annotations,
                  document: document,
                  settings: props.settings,
                }}
                committer={buildAnnotationsCommitter()}
              >
                <MainHeader title={document.title} />
                <DocumentAnnotator anonymizer={buildAnonymizer(props.settings)} />
              </AnnotatorStateHandlerContextProvider>
            </MonitoringEntriesHandlerContextProvider>
          )}
        </AnnotationsDataFetcher>
      )}
    </DocumentDataFetcher>
  );
}
