import { localStorageHandler } from '../localStorageHandler';
import { localStorageMappers } from '../localStorageMappers';

const TREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY = 'TREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY';

export { setOrderByProperty, getOrderByProperty, treatedDocumentOrderByProperties };

const treatedDocumentOrderByProperties = [
  'documentNumber',
  'publicationCategory',
  'userName',
  'date',
  'deletions',
  'resizeSmaller',
  'additions',
  'resizeBigger',
  'modifications',
  'duration',
] as const;

function setOrderByProperty(newOrderByProperty: typeof treatedDocumentOrderByProperties[number]) {
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    value: newOrderByProperty,
    mapper: localStorageMappers.string,
  });
}

function getOrderByProperty() {
  const orderByProperty = localStorageHandler.get({
    key: TREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    mapper: localStorageMappers.string,
  }) as typeof treatedDocumentOrderByProperties[number] | undefined;
  return orderByProperty;
}
