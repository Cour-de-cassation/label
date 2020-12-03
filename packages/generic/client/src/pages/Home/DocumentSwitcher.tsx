import React, { useState } from 'react';
import { buildAnonymizer, fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { useGraphQLMutation } from '../../graphQL';
import { buildAnnotatorStateCommitter } from '../../services/annotatorState';
import { DocumentAnnotator } from './DocumentAnnotator';
import { DocumentAndAnnotationsDataFetcher } from './DocumentAndAnnotationsDataFetcher';
import { DocumentSelector } from './DocumentSelector';

export { DocumentSwitcher };

type documentStateType =
  | { kind: 'annotating'; choice: { document: fetchedDocumentType; annotations: fetchedAnnotationType[] } }
  | { kind: 'selecting' };

function DocumentSwitcher(props: {
  annotations: fetchedAnnotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
  fetchNewDocument: () => Promise<void>;
}) {
  const [documentState, setDocumentState] = useState<documentStateType>(
    props.document.status === 'saved'
      ? { kind: 'annotating', choice: { document: props.document, annotations: props.annotations } }
      : { kind: 'selecting' },
  );
  const [updateDocumentStatus] = useGraphQLMutation<'updateDocumentStatus'>('updateDocumentStatus');

  return renderPage();

  function renderPage() {
    switch (documentState.kind) {
      case 'annotating':
        return (
          <DocumentAnnotator
            annotatorState={{
              annotations: documentState.choice.annotations,
              document: documentState.choice.document,
              settings: props.settings,
            }}
            annotatorStateCommitter={buildAnnotatorStateCommitter()}
            anonymizer={buildAnonymizer(props.settings)}
            onStopAnnotatingDocument={onStopAnnotatingDocument}
          />
        );
      case 'selecting':
        return (
          <DocumentAndAnnotationsDataFetcher documentIdsToExclude={[props.document._id]}>
            {({ document: documentChoice2, annotations: annotationsChoice2 }) => (
              <DocumentAndAnnotationsDataFetcher documentIdsToExclude={[props.document._id, documentChoice2._id]}>
                {({ document: documentChoice3, annotations: annotationsChoice3 }) => (
                  <DocumentSelector
                    choices={[
                      { document: props.document, annotations: props.annotations },
                      { document: documentChoice2, annotations: annotationsChoice2 },
                      { document: documentChoice3, annotations: annotationsChoice3 },
                    ]}
                    onSelectDocument={onSelectDocument}
                    settings={props.settings}
                  />
                )}
              </DocumentAndAnnotationsDataFetcher>
            )}
          </DocumentAndAnnotationsDataFetcher>
        );
    }
  }

  async function onStopAnnotatingDocument() {
    await props.fetchNewDocument();
    setDocumentState({ kind: 'selecting' });
  }

  async function onSelectDocument(choice: { document: fetchedDocumentType; annotations: fetchedAnnotationType[] }) {
    await updateDocumentStatus({ variables: { documentId: choice.document._id, status: 'saved' } });
    setDocumentState({ kind: 'annotating', choice });
  }
}
