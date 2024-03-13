import { documentGenerator, decisionMetadataGenerator } from './generator';
import { documentModel, documentType, fetchedDocumentModel, fetchedDocumentType } from './documentType';
import {
  buildDocument,
  comparator,
  computeCaseNumber,
  countWords,
  extractAdditionalAnnotationTerms,
  getNextStatus,
  getMinutesBeforeFreeingPendingDocuments,
  publicationHandler,
} from './lib';

export { documentModule };

export type { documentType, fetchedDocumentType };

const documentModule = {
  fetchedModel: fetchedDocumentModel,
  model: documentModel,
  generator: documentGenerator,
  decisionMetadataGenerator: decisionMetadataGenerator,
  lib: {
    buildDocument,
    comparator,
    computeCaseNumber,
    countWords,
    extractAdditionalAnnotationTerms,
    getNextStatus,
    getMinutesBeforeFreeingPendingDocuments,
    publicationHandler,
  },
};
