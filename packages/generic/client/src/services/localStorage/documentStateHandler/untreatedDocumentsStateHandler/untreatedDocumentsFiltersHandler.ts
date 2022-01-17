import { documentType } from '@label/core';
import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

const UNTREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY = 'UNTREATED_DOCUMENTS_FILTER_SOURCE';
const UNTREATED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY = 'UNTREATED_DOCUMENTS_FILTER_JURISDICTION';
const UNTREATED_DOCUMENTS_FILTER_ROUTE_STORAGE_KEY = 'UNTREATED_DOCUMENTS_FILTER_ROUTE';
const UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY =
  'UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER';
const UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE_STORAGE_KEY =
  'UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE';
const UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE_STORAGE_KEY =
  'UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE';

export { setFilters, getFilters };

export type { untreatedDocumentFilterType };

type untreatedDocumentFilterType = {
  jurisdiction: string | undefined;
  source: string | undefined;
  route: documentType['route'] | undefined;
  publicationCategoryLetter: string | undefined;
  documentCreationStartDate: Date | undefined;
  documentCreationEndDate: Date | undefined;
};

function setFilters({
  source,
  publicationCategoryLetter,
  jurisdiction,
  route,
  documentCreationEndDate,
  documentCreationStartDate,
}: untreatedDocumentFilterType) {
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY,
    value: source,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY,
    value: jurisdiction,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    value: publicationCategoryLetter,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_ROUTE_STORAGE_KEY,
    value: route,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE_STORAGE_KEY,
    value: documentCreationStartDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE_STORAGE_KEY,
    value: documentCreationEndDate,
    mapper: localStorageMappers.date,
  });
}

function getFilters(): untreatedDocumentFilterType {
  const jurisdiction = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const source = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const route = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_ROUTE_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const publicationCategoryLetter = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const documentCreationStartDate = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const documentCreationEndDate = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });

  return {
    jurisdiction: jurisdiction || undefined,
    source: source || undefined,
    route: (route as documentType['route']) || undefined,
    publicationCategoryLetter: publicationCategoryLetter || undefined,
    documentCreationStartDate: documentCreationStartDate || undefined,
    documentCreationEndDate: documentCreationEndDate || undefined,
  };
}
