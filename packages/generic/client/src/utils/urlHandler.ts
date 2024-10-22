export { urlHandler };

const urlHandler = {
  getApiUrl() {
    /*const clientPort = parseInt(window.location.port);
    const clientProtocol = window.location.protocol;
    const clientHostname = window.location.hostname;

    const serverPort = clientPort - 2;

    return serverPort ? `${clientProtocol}//${clientHostname}:${serverPort}` : `${clientProtocol}//${clientHostname}`;*/
    return `http://localhost:55430`;
  },

  getSsoLoginUrl() {
    return `${this.getApiUrl()}/label/api/sso/login`;
  },

  getSsoLogoutUrl() {
    return `${this.getApiUrl()}/label/api/sso/logout`;
  },
};
