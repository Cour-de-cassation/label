import React, { ReactElement } from 'react';
import { documentType } from '@label/core';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';

export { DocumentPanel };

function DocumentPanel(props: { document: documentType }): ReactElement {
  return (
    <div>
      <DocumentPanelHeader />
      <DocumentViewer document={props.document} />
    </div>
  );
}
