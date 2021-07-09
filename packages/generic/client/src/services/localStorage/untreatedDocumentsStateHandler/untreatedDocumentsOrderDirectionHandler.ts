import { localStorageHandler } from '../localStorageHandler';
import { localStorageMappers } from '../localStorageMappers';

const UNTREATED_DOCUMENTS_DIRECTION_STORAGE_KEY = 'UNTREATED_DOCUMENTS_DIRECTION_STORAGE_KEY';

export { setOrderDirection, getOrderDirection };

function setOrderDirection(newOrderDirection: 'asc' | 'desc') {
  localStorageHandler.set({
    key: UNTREATED_DOCUMENTS_DIRECTION_STORAGE_KEY,
    value: newOrderDirection,
    mapper: localStorageMappers.string,
  });
}

function getOrderDirection() {
  const orderByProperty = localStorageHandler.get({
    key: UNTREATED_DOCUMENTS_DIRECTION_STORAGE_KEY,
    mapper: localStorageMappers.string,
  }) as 'asc' | 'desc' | undefined;
  return orderByProperty;
}
