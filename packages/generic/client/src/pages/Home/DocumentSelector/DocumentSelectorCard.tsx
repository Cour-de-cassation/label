import React from 'react';
import { fetchedAnnotationType, fetchedDocumentType } from '@label/core';

export { DocumentSelectorCard };

function DocumentSelectorCard(props: {
  document: fetchedDocumentType;
  annotations: fetchedAnnotationType[];
  onSelect: () => void;
}) {
  return (
    <div>
      {props.document.title}
      <button onClick={props.onSelect}>Commencer</button>
    </div>
  );
}
