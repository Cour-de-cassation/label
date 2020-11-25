import React, { useState } from 'react';
import { buildAnonymizer, fetchedAnnotationType, fetchedDocumentType, settingsType } from '@label/core';
import { DocumentAnnotator } from './DocumentAnnotator';
import { buildAnnotatorStateCommitter } from '../../services/annotatorState';
import { DocumentSelector } from './DocumentSelector';

export { DocumentSwitcher };

function DocumentSwitcher(props: {
  annotations: fetchedAnnotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
  fetchNewDocument: () => Promise<void>;
}) {
  const [documentState, setDocumentState] = useState<'selecting' | 'annotating'>('annotating');

  return renderPage();

  function renderPage() {
    switch (documentState) {
      case 'annotating':
        return (
          <DocumentAnnotator
            annotatorState={{ annotations: props.annotations, document: props.document, settings: props.settings }}
            annotatorStateCommitter={buildAnnotatorStateCommitter()}
            anonymizer={buildAnonymizer(props.settings)}
            onStopAnnotatingDocument={onStopAnnotatingDocument}
          />
        );
      case 'selecting':
        return <DocumentSelector onSelectDocument={onSelectDocument} />;
    }
  }

  function onStopAnnotatingDocument() {
    setDocumentState('selecting');
  }

  async function onSelectDocument() {
    await props.fetchNewDocument();
    setDocumentState('annotating');
  }
}
