import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

const TO_BE_CONFIRMED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY =
  'TO_BE_CONFIRMED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY';

export { setOrderByProperty, getOrderByProperty, toBeConfirmedDocumentOrderByProperties };

const toBeConfirmedDocumentOrderByProperties = [
  'documentNumber',
  'occultationBlock',
  'jurisdiction',
  'publicationCategory',
  'userName',
  'reviewStatus',
  'treatmentDate',
  'duration',
] as const;

function setOrderByProperty(newOrderByProperty: typeof toBeConfirmedDocumentOrderByProperties[number]) {
  localStorageHandler.set({
    key: TO_BE_CONFIRMED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    value: newOrderByProperty,
    mapper: localStorageMappers.string,
  });
}

function getOrderByProperty() {
  const orderByProperty = localStorageHandler.get({
    key: TO_BE_CONFIRMED_DOCUMENTS_ORDER_BY_PROPERTY_STORAGE_KEY,
    mapper: localStorageMappers.string,
  }) as typeof toBeConfirmedDocumentOrderByProperties[number] | undefined;
  return orderByProperty;
}
