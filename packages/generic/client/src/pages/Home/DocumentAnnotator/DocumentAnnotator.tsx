import React, { ReactElement } from 'react';
import { buildAnonymizer, settingsModule, annotationType, documentType, settingsType } from '@label/core';
import { LayoutGrid } from '../../../components';
import { annotatorStateType } from '../../../services/annotatorState';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotations: annotationType[];
  settings: settingsType;
  document: documentType;
}): ReactElement {
  const annotatorState: annotatorStateType = {
    annotations: props.annotations,
    document: props.document,
    settings: props.settings,
  };

  const anonymizer = buildAnonymizer(props.settings);

  return (
    <LayoutGrid container>
      <LayoutGrid container item xs={4}>
        <AnnotationsPanel annotatorState={annotatorState} anonymizer={anonymizer} />
      </LayoutGrid>
      <LayoutGrid container item xs={8}>
        <DocumentPanel annotatorState={annotatorState} anonymizer={anonymizer} />
      </LayoutGrid>
    </LayoutGrid>
  );
}
