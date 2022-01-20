import { orderDirectionType } from 'pelta-design-system';
import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

const TREATED_DOCUMENTS_DIRECTION_STORAGE_KEY = 'TREATED_DOCUMENTS_DIRECTION_STORAGE_KEY';

export { setOrderDirection, getOrderDirection };

function setOrderDirection(newOrderDirection: orderDirectionType) {
  localStorageHandler.set({
    key: TREATED_DOCUMENTS_DIRECTION_STORAGE_KEY,
    value: newOrderDirection,
    mapper: localStorageMappers.string,
  });
}

function getOrderDirection() {
  const orderByProperty = localStorageHandler.get({
    key: TREATED_DOCUMENTS_DIRECTION_STORAGE_KEY,
    mapper: localStorageMappers.string,
  }) as orderDirectionType | undefined;
  return orderByProperty;
}
