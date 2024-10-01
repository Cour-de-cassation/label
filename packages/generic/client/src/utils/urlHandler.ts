export { urlHandler };

const urlHandler = {
  getApiUrl() {
    return `https://dev-label-api.teamlog.intra`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLoginUrl() {
    return `https://dev-label-api.teamlog.intra/label/api/sso/login`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLogoutUrl() {
    return `https://dev-label-api.teamlog.intra/label/api/sso/logout`;
  },
};
