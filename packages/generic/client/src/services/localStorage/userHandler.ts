import { userType } from '@label/core';

export { userHandler };

const USER_EMAIL_STORAGE_KEY = 'USER_EMAIL';
const USER_NAME_STORAGE_KEY = 'USER_NAME';
const USER_ROLE_STORAGE_KEY = 'USER_ROLE';

const userHandler = {
  set,
  remove,
  getEmail,
  getName,
  getRole,
};

function set({ email, name, role }: { email: userType['email']; name: userType['name']; role: userType['role'] }) {
  localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);
  localStorage.setItem(USER_NAME_STORAGE_KEY, name);
  localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
}

function remove() {
  localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
  localStorage.removeItem(USER_NAME_STORAGE_KEY);
  localStorage.removeItem(USER_ROLE_STORAGE_KEY);
}

function getEmail() {
  return localStorage.getItem(USER_EMAIL_STORAGE_KEY) as userType['email'] | null;
}

function getName() {
  return localStorage.getItem(USER_NAME_STORAGE_KEY) as userType['name'] | null;
}

function getRole() {
  return localStorage.getItem(USER_ROLE_STORAGE_KEY) as userType['role'] | null;
}
