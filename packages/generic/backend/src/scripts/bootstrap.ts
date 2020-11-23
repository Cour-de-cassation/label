import { bootstrap, environment } from '@label/core';

const bootstrapValues = {
  clientPort: environment.port.client,
  dbPort: environment.port.db,
  serverPort: environment.port.server,
};

const filesToBootstrap = [
  {
    template: './docker-compose-backend-template.yml',
    target: './docker-compose-backend.yml',
  },
  {
    template: './docker-compose-client-template.yml',
    target: './docker-compose-client.yml',
  },
];

bootstrap(filesToBootstrap, bootstrapValues);
