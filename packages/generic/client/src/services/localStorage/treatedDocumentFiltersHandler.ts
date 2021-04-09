import { getBooleanItem, getDateItem, setBooleanItem, setDateItem } from './utils';

const TREATED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_START_DATE';
const TREATED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_END_DATE';
const TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_USER_NAME';
const TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY =
  'TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER';
const TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS';
const TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS';

export { treatedDocumentFiltersHandler };

export type { treatedDocumentFilterType };

type treatedDocumentFilterType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  userName: string | undefined;
  publicationCategoryLetter: string | undefined;
  mustHaveSurAnnotations: boolean;
  mustHaveSubAnnotations: boolean;
};

const treatedDocumentFiltersHandler = {
  set,
  get,
};

function set({
  startDate,
  endDate,
  userName,
  publicationCategoryLetter,
  mustHaveSurAnnotations,
  mustHaveSubAnnotations,
}: treatedDocumentFilterType) {
  if (startDate) {
    setDateItem(TREATED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY, startDate);
  } else {
    localStorage.removeItem(TREATED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY);
  }
  if (endDate) {
    setDateItem(TREATED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY, endDate);
  } else {
    localStorage.removeItem(TREATED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY);
  }
  if (userName) {
    localStorage.setItem(TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY, userName);
  } else {
    localStorage.removeItem(TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY);
  }
  if (publicationCategoryLetter) {
    localStorage.setItem(TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY, publicationCategoryLetter);
  } else {
    localStorage.removeItem(TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY);
  }
  setBooleanItem(TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY, mustHaveSurAnnotations);
  setBooleanItem(TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY, mustHaveSubAnnotations);
}

function get(): treatedDocumentFilterType {
  const startDate = getDateItem(TREATED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY);
  const endDate = getDateItem(TREATED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY);
  const userName = localStorage.getItem(TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY);
  const publicationCategoryLetter = localStorage.getItem(
    TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
  );
  const mustHaveSurAnnotations = getBooleanItem(TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY);
  const mustHaveSubAnnotations = getBooleanItem(TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY);

  return {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    userName: userName || undefined,
    publicationCategoryLetter: publicationCategoryLetter || undefined,
    mustHaveSurAnnotations: mustHaveSurAnnotations || false,
    mustHaveSubAnnotations: mustHaveSubAnnotations || false,
  };
}
