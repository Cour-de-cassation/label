const BEARER_TOKEN_STORAGE_KEY = 'BEARER_TOKEN';

export { bearerTokenHandler };

const bearerTokenHandler = {
  set,
  remove,
  get,
};

function set(bearerToken: string) {
  localStorage.setItem(BEARER_TOKEN_STORAGE_KEY, bearerToken);
}

function remove() {
  localStorage.removeItem(BEARER_TOKEN_STORAGE_KEY);
}

function get() {
  return localStorage.getItem(BEARER_TOKEN_STORAGE_KEY);
}
