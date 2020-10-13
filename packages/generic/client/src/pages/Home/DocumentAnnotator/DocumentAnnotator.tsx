import React, { ReactElement } from 'react';
import { buildAnonymizer, settingsModule, annotationType, settingsType, documentType } from '@label/core';
import { LayoutGrid } from '../../../components';
import { AnnotationsPanel } from './AnnotationsPanel';
import { DocumentPanel } from './DocumentPanel';

export { DocumentAnnotator };

function DocumentAnnotator(props: {
  annotations: annotationType[];
  settingsJson: string;
  document: documentType;
}): ReactElement {
  const settings = settingsModule.lib.parseFromJson(props.settingsJson);

  const anonymizer = buildAnonymizer(settings);

  return (
    <LayoutGrid container>
      <LayoutGrid container item xs={4}>
        <AnnotationsPanel annotations={props.annotations} anonymizer={anonymizer} settings={settings} />
      </LayoutGrid>
      <LayoutGrid container item xs={8}>
        <DocumentPanel
          annotations={props.annotations}
          anonymizer={anonymizer}
          document={props.document}
          settings={settings}
        />
      </LayoutGrid>
    </LayoutGrid>
  );
}
