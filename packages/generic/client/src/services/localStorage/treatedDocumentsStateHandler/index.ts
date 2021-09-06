import {
  setFilters,
  getFilters,
  documentReviewFilterStatuses,
  treatedDocumentFilterType,
} from './treatedDocumentsFiltersHandler';
import {
  getOrderByProperty,
  setOrderByProperty,
  treatedDocumentOrderByProperties,
} from './treatedDocumentsOrderByPropertyHandler';
import { getOrderDirection, setOrderDirection } from './treatedDocumentsOrderDirectionHandler';
import { getSearchedDocumentNumber, setSearchedDocumentNumber } from './treatedDocumentsSearchedDocumentNumberHandler';

export { treatedDocumentsStateHandler, treatedDocumentOrderByProperties, documentReviewFilterStatuses };

export type { treatedDocumentFilterType };

const treatedDocumentsStateHandler = {
  getFilters,
  setFilters,
  getOrderByProperty,
  setOrderByProperty,
  getOrderDirection,
  setOrderDirection,
  getSearchedDocumentNumber,
  setSearchedDocumentNumber,
};
