import { documentGenerator } from './generator';
import { documentDataModel, documentType, fetchedDocumentType } from './documentType';
import { buildDocument, comparator, countWords } from './lib';

export { documentModule };

export type { documentType, fetchedDocumentType };

const documentModule = {
  dataModel: documentDataModel,
  generator: documentGenerator,
  lib: { buildDocument, comparator, countWords },
};
