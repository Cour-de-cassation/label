import React from 'react';
import { useParams } from 'react-router-dom';
import { DocumentDataFetcher } from './DocumentDataFetcher';

export { DocumentInspector };

type DocumentInspectorParamsType = {
  documentId: string;
};

function DocumentInspector() {
  const params = useParams<DocumentInspectorParamsType>();

  return (
    <DocumentDataFetcher documentId={params.documentId} alwaysDisplayHeader>
      {({ document }) => <div>{document.text}</div>}
    </DocumentDataFetcher>
  );
}
