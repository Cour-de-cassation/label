const BEARER_TOKEN_STORAGE_KEY = 'BEARER_TOKEN';

export { getBearerTokenFromLocalStorage, setBearerTokenIntoLocalStorage, deleteBearerTokenInLocalStorage };

const setBearerTokenIntoLocalStorage = (bearerToken: string) => {
  localStorage.setItem(BEARER_TOKEN_STORAGE_KEY, bearerToken);
};

const deleteBearerTokenInLocalStorage = () => {
  localStorage.removeItem(BEARER_TOKEN_STORAGE_KEY);
};

const getBearerTokenFromLocalStorage = () => localStorage.getItem(BEARER_TOKEN_STORAGE_KEY);
