import React, { useState } from 'react';
import { buildAnonymizer, fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { useGraphQLMutation } from '../../graphQL';
import { buildAnnotatorStateCommitter } from '../../services/annotatorState';
import { DocumentAnnotator } from './DocumentAnnotator';
import { DocumentAndAnnotationsDataFetcher } from './DocumentAndAnnotationsDataFetcher';
import { DocumentSelector } from './DocumentSelector';
import { MainHeader } from '../../components/business/MainHeader';

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
  const [annotationStartTimestamp, setAnnotationStartTimestamp] = useState(0);
  const [updateDocumentStatus] = useGraphQLMutation<'updateDocumentStatus'>('updateDocumentStatus');
  const styles = buildStyles();

  return <div style={styles.documentSwitcher}>{renderPage()}</div>;

  function renderPage() {
    switch (documentState.kind) {
      case 'annotating':
        return (
          <>
            <MainHeader title={documentState.choice.document.title} />
            <DocumentAnnotator
              annotatorState={{
                annotations: documentState.choice.annotations,
                document: documentState.choice.document,
                settings: props.settings,
              }}
              annotationStartTimestamp={annotationStartTimestamp}
              annotatorStateCommitter={buildAnnotatorStateCommitter()}
              anonymizer={buildAnonymizer(props.settings)}
              onStopAnnotatingDocument={onStopAnnotatingDocument}
            />
          </>
        );
      case 'selecting':
        return (
          <DocumentAndAnnotationsDataFetcher documentIdsToExclude={[props.document._id]}>
            {({ document: documentChoice2, annotations: annotationsChoice2 }) => (
              <DocumentAndAnnotationsDataFetcher documentIdsToExclude={[props.document._id, documentChoice2._id]}>
                {({ document: documentChoice3, annotations: annotationsChoice3 }) => (
                  <>
                    <MainHeader />
                    <DocumentSelector
                      choices={[
                        { document: props.document, annotations: props.annotations },
                        { document: documentChoice2, annotations: annotationsChoice2 },
                        { document: documentChoice3, annotations: annotationsChoice3 },
                      ]}
                      onSelectDocument={onSelectDocument}
                      settings={props.settings}
                    />
                  </>
                )}
              </DocumentAndAnnotationsDataFetcher>
            )}
          </DocumentAndAnnotationsDataFetcher>
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
      } as const,
    };
  }

  async function onStopAnnotatingDocument() {
    await props.fetchNewDocument();
    setDocumentState({ kind: 'selecting' });
  }

  async function onSelectDocument(choice: { document: fetchedDocumentType; annotations: fetchedAnnotationType[] }) {
    setAnnotationStartTimestamp(new Date().getTime());
    await updateDocumentStatus({ variables: { documentId: choice.document._id, status: 'saved' } });
    setDocumentState({ kind: 'annotating', choice });
  }
}
