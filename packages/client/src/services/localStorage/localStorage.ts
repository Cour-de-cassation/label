const BEARER_TOKEN_STORAGE_KEY = 'BEARER_TOKEN';

export { getBearerTokenFromLocalStorage, setBearerTokenIntoLocalStorage };

const setBearerTokenIntoLocalStorage = (bearerToken: string) => {
  localStorage.setItem(BEARER_TOKEN_STORAGE_KEY, bearerToken);
};

const getBearerTokenFromLocalStorage = () => localStorage.getItem(BEARER_TOKEN_STORAGE_KEY);
