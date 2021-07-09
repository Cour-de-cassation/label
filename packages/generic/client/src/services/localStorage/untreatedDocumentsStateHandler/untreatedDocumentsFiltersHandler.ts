import { localStorageHandler } from '../localStorageHandler';
import { localStorageMappers } from '../localStorageMappers';

const UNTREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY = 'UNTREATED_DOCUMENTS_FILTER_SOURCE';
const UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY =
  'UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER';

export { setFilters, getFilters };

export type { untreatedDocumentFilterType };

type untreatedDocumentFilterType = {
  source: string | undefined;
  publicationCategoryLetter: string | undefined;
};

function setFilters({ source, publicationCategoryLetter }: untreatedDocumentFilterType) {
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY,
    value: source,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    value: publicationCategoryLetter,
    mapper: localStorageMappers.string,
  });
}

function getFilters(): untreatedDocumentFilterType {
  const source = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const publicationCategoryLetter = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });

  return {
    source: source || undefined,
    publicationCategoryLetter: publicationCategoryLetter || undefined,
  };
}
