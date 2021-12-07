import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

const PUBLISHABLE_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY = 'PUBLISHABLE_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY';

export { setOrderByProperty, getOrderByProperty, publishableDocumentOrderByProperties };

const publishableDocumentOrderByProperties = [
  'appealNumber',
  'chamberName',
  'creationDate',
  'documentNumber',
  'jurisdiction',
  'status',
] as const;

function setOrderByProperty(newOrderByProperty: typeof publishableDocumentOrderByProperties[number]) {
  localStorageHandler.set({
    key: PUBLISHABLE_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    value: newOrderByProperty,
    mapper: localStorageMappers.string,
  });
}

function getOrderByProperty() {
  const orderByProperty = localStorageHandler.get({
    key: PUBLISHABLE_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    mapper: localStorageMappers.string,
  }) as typeof publishableDocumentOrderByProperties[number] | undefined;
  return orderByProperty;
}
