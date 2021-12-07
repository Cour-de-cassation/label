import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';
import { documentReviewFilterStatuses } from '../../../filters';

const TO_BE_CONFIRMED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY = 'TO_BE_CONFIRMED_DOCUMENTS_FILTER_START_DATE';
const TO_BE_CONFIRMED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY = 'TO_BE_CONFIRMED_DOCUMENTS_FILTER_END_DATE';
const TO_BE_CONFIRMED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS_STORAGE_KEY =
  'TO_BE_CONFIRMED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS';
const TO_BE_CONFIRMED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY = 'TO_BE_CONFIRMED_DOCUMENTS_FILTER_JURISDICTION';
const TO_BE_CONFIRMED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY = 'TO_BE_CONFIRMED_DOCUMENTS_FILTER_USER_NAME';
const TO_BE_CONFIRMED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY =
  'TO_BE_CONFIRMED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER';
const TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY = 'TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUR_ANNOTATIONS';
const TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY = 'TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUB_ANNOTATIONS';

export { setFilters, getFilters };

export type { toBeConfirmedDocumentFilterType };

type toBeConfirmedDocumentFilterType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  documentReviewFilterStatus: typeof documentReviewFilterStatuses[number] | undefined;
  jurisdiction: string | undefined;
  userName: string | undefined;
  publicationCategoryLetter: string | undefined;
  mustHaveSurAnnotations: boolean;
  mustHaveSubAnnotations: boolean;
};

function setFilters({
  startDate,
  endDate,
  documentReviewFilterStatus,
  jurisdiction,
  userName,
  publicationCategoryLetter,
  mustHaveSurAnnotations,
  mustHaveSubAnnotations,
}: toBeConfirmedDocumentFilterType) {
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY,
    value: startDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY,
    value: endDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS_STORAGE_KEY,
    value: documentReviewFilterStatus,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY,
    value: jurisdiction,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY,
    value: userName,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    value: publicationCategoryLetter,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY,
    value: mustHaveSurAnnotations,
    mapper: localStorageMappers.boolean,
  });
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY,
    value: mustHaveSubAnnotations,
    mapper: localStorageMappers.boolean,
  });
}

function getFilters(): toBeConfirmedDocumentFilterType {
  const startDate = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_START_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const endDate = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_END_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const documentReviewFilterStatus = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const jurisdiction = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const userName = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const publicationCategoryLetter = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const mustHaveSurAnnotations = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY,
    mapper: localStorageMappers.boolean,
  });
  const mustHaveSubAnnotations = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY,
    mapper: localStorageMappers.boolean,
  });

  return {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    documentReviewFilterStatus:
      (documentReviewFilterStatus as typeof documentReviewFilterStatuses[number]) || undefined,
    jurisdiction: jurisdiction || undefined,
    userName: userName || undefined,
    publicationCategoryLetter: publicationCategoryLetter || undefined,
    mustHaveSurAnnotations: mustHaveSurAnnotations || false,
    mustHaveSubAnnotations: mustHaveSubAnnotations || false,
  };
}
