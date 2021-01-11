import { bootstrap, environment } from '@label/core';

const bootstrapValues = {
  clientPort: environment.port.client,
  dbName: environment.dbName,
  dbPort: environment.port.db,
  serverPort: environment.port.server,
};

const filesToBootstrap = [
  {
    template: './templates/docker-compose-local-template.yml',
    target: './templates/docker-compose-local.yml',
  },
  {
    template: './templates/docker-compose-prod-template.yml',
    target: './templates/docker-compose-prod.yml',
  },
  {
    template: './templates/docker-compose-client-template.yml',
    target: './templates/docker-compose-client.yml',
  },
  {
    template: './templates/startProd-template.sh',
    target: './templates/startProd.sh',
  },
];

bootstrap(filesToBootstrap, bootstrapValues);
