import { documentGenerator, decisionMetadataGenerator, checklistGenerator } from './generator';
import { documentModel, documentType, fetchedDocumentModel, fetchedDocumentType } from './documentType';
import {
  buildDocument,
  comparator,
  computeCaseNumber,
  countWords,
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
  checklistGenerator: checklistGenerator,
  lib: {
    buildDocument,
    comparator,
    computeCaseNumber,
    countWords,
    getNextStatus,
    getMinutesBeforeFreeingPendingDocuments,
    publicationHandler,
  },
};
