import { setFilters, getFilters, toBeConfirmedDocumentFilterType } from './toBeConfirmedDocumentsFiltersHandler';
import {
  getOrderByProperty,
  setOrderByProperty,
  toBeConfirmedDocumentOrderByProperties,
} from './toBeConfirmedDocumentsOrderByPropertyHandler';
import { getOrderDirection, setOrderDirection } from './toBeConfirmedDocumentsOrderDirectionHandler';
import { getSearchedDocumentNumber, setSearchedDocumentNumber } from './treatedDocumentsSearchedDocumentNumberHandler';

export { toBeConfirmedDocumentsStateHandler, toBeConfirmedDocumentOrderByProperties };

export type { toBeConfirmedDocumentFilterType };

const toBeConfirmedDocumentsStateHandler = {
  getFilters,
  setFilters,
  getOrderByProperty,
  setOrderByProperty,
  getOrderDirection,
  setOrderDirection,
  getSearchedDocumentNumber,
  setSearchedDocumentNumber,
};
