import { setFilters, getFilters, treatedDocumentFilterType } from './treatedDocumentsFiltersHandler';
import {
  getOrderByProperty,
  setOrderByProperty,
  treatedDocumentOrderByProperties,
} from './treatedDocumentsOrderByPropertyHandler';
import { getOrderDirection, setOrderDirection } from './treatedDocumentsOrderDirectionHandler';
import { getSearchedDocumentNumber, setSearchedDocumentNumber } from './treatedDocumentsSearchedDocumentNumberHandler';

export { treatedDocumentsStateHandler, treatedDocumentOrderByProperties };

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
