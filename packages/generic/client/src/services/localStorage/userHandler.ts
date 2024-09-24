import { userType } from '@label/core';
import { localStorageHandler } from './localStorageHandler';
import { localStorageMappers } from './localStorageMappers';

export { userHandler };

const USER_ID_STORAGE_KEY = 'USER_ID';
const USER_EMAIL_STORAGE_KEY = 'USER_EMAIL';
const USER_NAME_STORAGE_KEY = 'USER_NAME';
const USER_ROLE_STORAGE_KEY = 'USER_ROLE';

const userHandler = {
  set,
  remove,
  getId,
  getEmail,
  getName,
  getRole,
};

function set({ _id, email, name, role }: Pick<userType, '_id' | 'email' | 'role' | 'name'>) {
  localStorageHandler.set({ key: USER_ID_STORAGE_KEY, value: _id, mapper: localStorageMappers.id });
  localStorageHandler.set({ key: USER_EMAIL_STORAGE_KEY, value: email, mapper: localStorageMappers.string });
  localStorageHandler.set({ key: USER_NAME_STORAGE_KEY, value: name, mapper: localStorageMappers.string });
  localStorageHandler.set({ key: USER_ROLE_STORAGE_KEY, value: role, mapper: localStorageMappers.string });
}


function remove() {
  localStorageHandler.set({ key: USER_ID_STORAGE_KEY, value: undefined, mapper: localStorageMappers.id });
  localStorageHandler.set({ key: USER_EMAIL_STORAGE_KEY, value: undefined, mapper: localStorageMappers.string });
  localStorageHandler.set({ key: USER_NAME_STORAGE_KEY, value: undefined, mapper: localStorageMappers.string });
  localStorageHandler.set({ key: USER_ROLE_STORAGE_KEY, value: undefined, mapper: localStorageMappers.string });
}

function getId() {
  return localStorageHandler.get({ key: USER_ID_STORAGE_KEY, mapper: localStorageMappers.id });
}

function getEmail() {
  return localStorageHandler.get({ key: USER_EMAIL_STORAGE_KEY, mapper: localStorageMappers.string });
}

function getName() {
  return localStorageHandler.get({ key: USER_NAME_STORAGE_KEY, mapper: localStorageMappers.string });
}

function getRole() {
  return localStorageHandler.get({ key: USER_ROLE_STORAGE_KEY, mapper: localStorageMappers.string }) as
    | userType['role']
    | undefined;
}
