import { documentType } from '@label/core';
import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';
import { documentReviewFilterStatuses } from '../../../filters';

const TREATED_DOCUMENTS_FILTER_TREATMENT_START_DATE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_TREATMENT_START_DATE';
const TREATED_DOCUMENTS_FILTER_TREATMENT_END_DATE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_TREATMENT_END_DATE';
const TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE_STORAGE_KEY =
  'TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE';
const TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE_STORAGE_KEY =
  'TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE';
const TREATED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS';
const TREATED_DOCUMENTS_FILTER_ROUTE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_ROUTE';
const TREATED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_JURISDICTION';
const TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_USER_NAME';
const TREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_SOURCE';
const TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER_STORAGE_KEY =
  'TREATED_DOCUMENTS_FILTER_PUBLICATION_CATEGORY_LETTER';
const TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_SUR_ANNOTATIONS';
const TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS_STORAGE_KEY = 'TREATED_DOCUMENTS_FILTER_SUB_ANNOTATIONS';

export { setFilters, getFilters };

export type { treatedDocumentFilterType };

type treatedDocumentFilterType = {
  treatmentStartDate: Date | undefined;
  treatmentEndDate: Date | undefined;
  documentCreationStartDate: Date | undefined;
  documentCreationEndDate: Date | undefined;
  documentReviewFilterStatus: typeof documentReviewFilterStatuses[number] | undefined;
  jurisdiction: string | undefined;
  userName: string | undefined;
  source: string | undefined;
  route: documentType['route'] | undefined;
  publicationCategoryLetter: string | undefined;
  mustHaveSurAnnotations: boolean;
  mustHaveSubAnnotations: boolean;
};

function setFilters({
  treatmentStartDate,
  treatmentEndDate,
  documentCreationStartDate,
  documentCreationEndDate,
  documentReviewFilterStatus,
  jurisdiction,
  userName,
  source,
  route,
  publicationCategoryLetter,
  mustHaveSurAnnotations,
  mustHaveSubAnnotations,
}: treatedDocumentFilterType) {
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_TREATMENT_START_DATE_STORAGE_KEY,
    value: treatmentStartDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_TREATMENT_END_DATE_STORAGE_KEY,
    value: treatmentEndDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE_STORAGE_KEY,
    value: documentCreationStartDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE_STORAGE_KEY,
    value: documentCreationEndDate,
    mapper: localStorageMappers.date,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS_STORAGE_KEY,
    value: documentReviewFilterStatus,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_ROUTE_STORAGE_KEY,
    value: route,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY,
    value: jurisdiction,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY,
    value: userName,
    mapper: localStorageMappers.string,
  });
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY,
    value: source,
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
  const treatmentStartDate = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_TREATMENT_START_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const treatmentEndDate = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_TREATMENT_END_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const documentCreationStartDate = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_START_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const documentCreationEndDate = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_DOCUMENT_CREATION_END_DATE_STORAGE_KEY,
    mapper: localStorageMappers.date,
  });
  const documentReviewFilterStatus = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_DOCUMENT_REVIEW_STATUS_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const route = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_ROUTE_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const jurisdiction = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_JURISDICTION_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const userName = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_USER_NAME_STORAGE_KEY,
    mapper: localStorageMappers.string,
  });
  const source = localStorageHandler.get({
    key: TREATED_DOCUMENTS_FILTER_SOURCE_STORAGE_KEY,
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
    treatmentStartDate: treatmentStartDate || undefined,
    treatmentEndDate: treatmentEndDate || undefined,
    documentCreationStartDate: documentCreationStartDate || undefined,
    documentCreationEndDate: documentCreationEndDate || undefined,
    documentReviewFilterStatus:
      (documentReviewFilterStatus as typeof documentReviewFilterStatuses[number]) || undefined,
    jurisdiction: jurisdiction || undefined,
    source: source || undefined,
    route: (route as documentType['route']) || undefined,
    userName: userName || undefined,
    publicationCategoryLetter: publicationCategoryLetter || undefined,
    mustHaveSurAnnotations: mustHaveSurAnnotations || false,
    mustHaveSubAnnotations: mustHaveSubAnnotations || false,
  };
}
