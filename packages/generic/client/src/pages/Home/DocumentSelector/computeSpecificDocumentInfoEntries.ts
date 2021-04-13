import { fetchedDocumentType } from '@label/core';

export { computeSpecificDocumentInfoEntries };

function computeSpecificDocumentInfoEntries(document: fetchedDocumentType) {
  return {
    decisionNumber: document.documentNumber,
    chamberName: document.decisionMetadata.chamberName || '-',
  };
}
