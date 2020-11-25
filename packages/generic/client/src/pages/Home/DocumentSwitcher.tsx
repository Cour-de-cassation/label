import React, { useState } from 'react';
import { buildAnonymizer, fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { buildAnnotatorStateCommitter } from '../../services/annotatorState';
import { DocumentAnnotator } from './DocumentAnnotator';
import { DocumentSelector } from './DocumentSelector';

export { DocumentSwitcher };

type documentStateType = 'annotating' | 'selecting';

function DocumentSwitcher(props: {
  annotations: fetchedAnnotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
  fetchNewDocument: () => Promise<void>;
}) {
  const [documentState, setDocumentState] = useState<documentStateType>('selecting');

  return renderPage();

  function renderPage() {
    switch (documentState) {
      case 'annotating':
        return (
          <DocumentAnnotator
            annotatorState={{
              annotations: props.annotations,
              document: props.document,
              settings: props.settings,
            }}
            annotatorStateCommitter={buildAnnotatorStateCommitter()}
            anonymizer={buildAnonymizer(props.settings)}
            onStopAnnotatingDocument={onStopAnnotatingDocument}
          />
        );
      case 'selecting':
        return (
          <DocumentSelector
            document={props.document}
            annotations={props.annotations}
            onSelectDocument={onSelectDocument}
          />
        );
    }
  }

  async function onStopAnnotatingDocument() {
    await props.fetchNewDocument();
    setDocumentState('selecting');
  }

  function onSelectDocument() {
    setDocumentState('annotating');
  }
}
