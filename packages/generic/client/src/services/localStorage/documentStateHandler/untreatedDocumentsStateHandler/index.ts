import { setFilters, getFilters, untreatedDocumentFilterType } from './untreatedDocumentsFiltersHandler';
import {
  getOrderByProperty,
  setOrderByProperty,
  untreatedDocumentOrderByProperties,
} from './untreatedDocumentsOrderByPropertyHandler';
import { getOrderDirection, setOrderDirection } from './untreatedDocumentsOrderDirectionHandler';
import {
  getSearchedDocumentNumber,
  setSearchedDocumentNumber,
} from './untreatedDocumentsSearchedDocumentNumberHandler';

export { untreatedDocumentsStateHandler, untreatedDocumentOrderByProperties };

export type { untreatedDocumentFilterType };

const untreatedDocumentsStateHandler = {
  getFilters,
  setFilters,
  getOrderByProperty,
  setOrderByProperty,
  getOrderDirection,
  setOrderDirection,
  getSearchedDocumentNumber,
  setSearchedDocumentNumber,
};
