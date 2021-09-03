import {
  setFilters,
  getFilters,
  documentReviewFilterStatusType,
  treatedDocumentFilterType,
} from './treatedDocumentsFiltersHandler';
import {
  getOrderByProperty,
  setOrderByProperty,
  treatedDocumentOrderByProperties,
} from './treatedDocumentsOrderByPropertyHandler';
import { getOrderDirection, setOrderDirection } from './treatedDocumentsOrderDirectionHandler';
import { getSearchedDocumentNumber, setSearchedDocumentNumber } from './treatedDocumentsSearchedDocumentNumberHandler';

export { treatedDocumentsStateHandler, treatedDocumentOrderByProperties };

export type { documentReviewFilterStatusType, treatedDocumentFilterType };

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
