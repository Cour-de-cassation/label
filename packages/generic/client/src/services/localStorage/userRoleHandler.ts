import { userType } from '@label/core';

export { userRoleHandler };

const USER_ROLE_STORAGE_KEY = 'USER_ROLE';

const userRoleHandler = {
  set,
  remove,
  get,
};

function set(userRole: userType['role']) {
  localStorage.setItem(USER_ROLE_STORAGE_KEY, userRole);
}

function remove() {
  localStorage.removeItem(USER_ROLE_STORAGE_KEY);
}

function get() {
  return localStorage.getItem(USER_ROLE_STORAGE_KEY) as userType['role'] | null;
}
