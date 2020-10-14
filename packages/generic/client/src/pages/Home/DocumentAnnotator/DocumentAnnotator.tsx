import React, { ReactElement } from 'react';
import { buildAnonymizer, settingsType } from '@label/core';
import { LayoutGrid } from '../../../components';
import { useAnnotatorState } from '../../../services/annotatorState';
import { fetchedAnnotationType, fetchedDocumentType } from '../../../types';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotations: fetchedAnnotationType[];
  settings: settingsType;
  document: fetchedDocumentType;
}): ReactElement {
  const { annotatorStateHandler } = useAnnotatorState({
    annotations: props.annotations,
    document: props.document,
    settings: props.settings,
  });

  const anonymizer = buildAnonymizer(props.settings);

  return (
    <LayoutGrid container>
      <LayoutGrid container item xs={4}>
        <AnnotationsPanel annotatorStateHandler={annotatorStateHandler} anonymizer={anonymizer} />
      </LayoutGrid>
      <LayoutGrid container item xs={8}>
        <DocumentPanel annotatorStateHandler={annotatorStateHandler} anonymizer={anonymizer} />
      </LayoutGrid>
    </LayoutGrid>
  );
}
