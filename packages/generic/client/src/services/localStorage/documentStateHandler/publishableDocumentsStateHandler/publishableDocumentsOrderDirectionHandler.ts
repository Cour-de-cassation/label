import { orderDirectionType } from '../../../../components';
import { localStorageHandler } from '../../localStorageHandler';
import { localStorageMappers } from '../../localStorageMappers';

const PUBLISHABLE_DOCUMENTS_DIRECTION_STORAGE_KEY = 'PUBLISHABLE_DOCUMENTS_DIRECTION_STORAGE_KEY';

export { setOrderDirection, getOrderDirection };

function setOrderDirection(newOrderDirection: orderDirectionType) {
  localStorageHandler.set({
    key: PUBLISHABLE_DOCUMENTS_DIRECTION_STORAGE_KEY,
    value: newOrderDirection,
    mapper: localStorageMappers.string,
  });
}

function getOrderDirection() {
  const orderByProperty = localStorageHandler.get({
    key: PUBLISHABLE_DOCUMENTS_DIRECTION_STORAGE_KEY,
    mapper: localStorageMappers.string,
  }) as orderDirectionType | undefined;
  return orderByProperty;
}
