import { setFilters, getFilters, treatedDocumentFilterType } from './treatedDocumentsFiltersHandler';
import {
  getOrderByProperty,
  setOrderByProperty,
  treatedDocumentOrderByProperties,
} from './treatedDocumentsOrderByPropertyHandler';
import { getOrderDirection, setOrderDirection } from './treatedDocumentsOrderDirectionHandler';

export { treatedDocumentsStateHandler, treatedDocumentOrderByProperties };

export type { treatedDocumentFilterType };

const treatedDocumentsStateHandler = {
  getFilters,
  setFilters,
  getOrderByProperty,
  setOrderByProperty,
  getOrderDirection,
  setOrderDirection,
};
