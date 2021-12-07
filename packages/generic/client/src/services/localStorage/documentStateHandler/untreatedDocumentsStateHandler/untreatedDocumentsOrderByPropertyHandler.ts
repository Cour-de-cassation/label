import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

const UNTREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY = 'UNTREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY';

export { setOrderByProperty, getOrderByProperty, untreatedDocumentOrderByProperties };

const untreatedDocumentOrderByProperties = [
  'documentNumber',
  'occultationBlock',
  'jurisdiction',
  'publicationCategory',
  'source',
  'userName',
  'route',
  'status',
  'decisionDate',
] as const;

function setOrderByProperty(newOrderByProperty: typeof untreatedDocumentOrderByProperties[number]) {
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    value: newOrderByProperty,
    mapper: localStorageMappers.string,
  });
}

function getOrderByProperty() {
  const orderByProperty = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    mapper: localStorageMappers.string,
  }) as typeof untreatedDocumentOrderByProperties[number] | undefined;
  return orderByProperty;
}
