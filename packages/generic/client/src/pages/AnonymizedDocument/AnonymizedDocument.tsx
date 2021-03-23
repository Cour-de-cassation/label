import React from 'react';
import { useParams } from 'react-router';
import { AnonymizedDocumentTextDataFetcher } from './AnonymizedDocumentTextDataFetcher';

export { AnonymizedDocument };

type AnonymizedDocumentParamsType = {
  documentId: string;
};

function AnonymizedDocument() {
  const params = useParams<AnonymizedDocumentParamsType>();

  return (
    <AnonymizedDocumentTextDataFetcher documentId={params.documentId}>
      {({ anonymizedDocumentText }) => <div>{anonymizedDocumentText}</div>}
    </AnonymizedDocumentTextDataFetcher>
  );
}
