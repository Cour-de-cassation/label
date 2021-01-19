import { environmentHandler } from '@label/core';

export { urlHandler };

const urlHandler = {
  getApiUrl() {
    const clientPort = parseInt(window.location.port);
    const clientProtocol = window.location.protocol;
    const clientHostname = window.location.hostname;

    const serverPort = environmentHandler.convertClientPortToServerPort(clientPort);

    return `${clientProtocol}//${clientHostname}:${serverPort}`;
  },
};
