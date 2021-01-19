export { environmentHandler };

const environmentHandler = {
  convertClientPortToServerPort,
  convertServerPortToClientPort,
};

function convertClientPortToServerPort(clientPort: number): number {
  return clientPort - 2;
}

function convertServerPortToClientPort(serverPort: number): number {
  return serverPort + 2;
}
