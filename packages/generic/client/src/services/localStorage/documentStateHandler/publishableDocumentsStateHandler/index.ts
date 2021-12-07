import {
  getOrderByProperty,
  setOrderByProperty,
  publishableDocumentOrderByProperties,
} from './publishableDocumentsOrderByPropertyHandler';
import { getOrderDirection, setOrderDirection } from './publishableDocumentsOrderDirectionHandler';

export { publishableDocumentsStateHandler, publishableDocumentOrderByProperties };

const publishableDocumentsStateHandler = {
  getOrderByProperty,
  setOrderByProperty,
  getOrderDirection,
  setOrderDirection,
};
