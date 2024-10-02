export { urlHandler };

const urlHandler = {
  getApiUrl() {
    return process.env.REACT_APP_BACKEND_API_URL
        ? `${process.env.REACT_APP_BACKEND_API_URL}` : `https://dev-label-api.teamlog.intra`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLoginUrl() {
    return `${this.getApiUrl()}/label/api/sso/login`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLogoutUrl() {
    return `${this.getApiUrl()}/label/api/sso/logout`;
  },
};
