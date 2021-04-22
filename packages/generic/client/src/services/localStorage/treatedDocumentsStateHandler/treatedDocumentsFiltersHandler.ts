import { localStorageHandler } from '../localStorageHandler';
import { localStorageMappers } from '../localStorageMappers';

const TREATED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_START_DATE';
const TREATED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_END_DATE';
const TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_USER_NAME';
const TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY =
  'TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER';
const TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS';
const TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS';

export { setFilters, getFilters };

export type { treatedDocumentFilterType };

type treatedDocumentFilterType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  userName: string | undefined;
  publicationCategoryLetter: string | undefined;
  mustHaveSurAnnotations: boolean;
  mustHaveSubAnnotations: boolean;
};

function setFilters({
  startDate,
  endDate,
  userName,
  publicationCategoryLetter,
  mustHaveSurAnnotations,
  mustHaveSubAnnotations,
}: treatedDocumentFilterType) {
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY,
    value: startDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY,
    value: endDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY,
    value: userName,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    value: publicationCategoryLetter,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY,
    value: mustHaveSurAnnotations,
    mapper: localStorageMappers.boolean,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY,
    value: mustHaveSubAnnotations,
    mapper: localStorageMappers.boolean,
  });
}

function getFilters(): treatedDocumentFilterType {
  const startDate = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const endDate = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const userName = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const publicationCategoryLetter = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const mustHaveSurAnnotations = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY,
    mapper: localStorageMappers.boolean,
  });
  const mustHaveSubAnnotations = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY,
    mapper: localStorageMappers.boolean,
  });

  return {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    userName: userName || undefined,
    publicationCategoryLetter: publicationCategoryLetter || undefined,
    mustHaveSurAnnotations: mustHaveSurAnnotations || false,
    mustHaveSubAnnotations: mustHaveSubAnnotations || false,
  };
}
