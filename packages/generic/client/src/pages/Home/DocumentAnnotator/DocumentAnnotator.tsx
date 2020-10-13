import React, { ReactElement } from 'react';
import { buildAnonymizer, settingsModule, annotationType, documentType } from '@label/core';
import { LayoutGrid } from '../../../components';
import { annotatorStateType } from '../../../services/annotatorState';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotations: annotationType[];
  settingsJson: string;
  document: documentType;
}): ReactElement {
  const settings = settingsModule.lib.parseFromJson(props.settingsJson);

  const annotatorState: annotatorStateType = {
    annotations: props.annotations,
    document: props.document,
    settings: settings,
  };

  const anonymizer = buildAnonymizer(settings);

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
