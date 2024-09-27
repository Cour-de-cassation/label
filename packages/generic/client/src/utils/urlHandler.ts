export { urlHandler };

const urlHandler = {
  getApiUrl() {
    console.log("test API URL");
    console.log(process.env.REACT_APP_LABEL_API_URL);
    console.log(`${process.env.REACT_APP_LABEL_API_URL}`);
    return `${process.env.REACT_APP_LABEL_API_URL}`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLoginUrl() {
    return `${process.env.REACT_APP_SSO_API_LOGIN_URL}`;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getSsoLogoutUrl() {
    return `${process.env.REACT_APP_SSO_API_LOGOUT_URL}`;
  },
};
