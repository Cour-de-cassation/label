import { documentType } from '../documentType';

export { computeCaseNumber };

function computeCaseNumber(document: Pick<documentType, 'decisionMetadata' | 'documentNumber'>): number {
  if (document.decisionMetadata.boundDecisionDocumentNumbers.length > 0) {
    return document.decisionMetadata.boundDecisionDocumentNumbers[0];
  }
  return document.documentNumber;
}
