import React, { ReactElement } from 'react';
import { documentType } from '@label/core';
import { DocumentPanelHeader } from './DocumentPanelHeader';
import { DocumentViewer } from './DocumentViewer';
import { LayoutGrid } from '../../../../components';

export { DocumentPanel };

function DocumentPanel(props: { document: documentType }): ReactElement {
  return (
    <LayoutGrid container>
      <DocumentPanelHeader />
      <DocumentViewer document={props.document} />
    </LayoutGrid>
  );
}
