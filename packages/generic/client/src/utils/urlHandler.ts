export { urlHandler };

const urlHandler = {
  getApiUrl() {
    return `${process.env.REACT_APP_BACKEND_API_URL}`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLoginUrl() {
    return `${process.env.REACT_APP_BACKEND_API_URL}/label/api/sso/login`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLogoutUrl() {
    return `${process.env.REACT_APP_BACKEND_API_URL}/label/api/sso/logout`;
  },
};
