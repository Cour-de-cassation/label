import { bootstrap, environments } from '@label/core';

const bootstrapLocalValues = buildBootstrapValue('local');
const bootstrapProdValues = buildBootstrapValue('prod');

const filesToBootstrapForLocal = [
  {
    template: './templates/docker-compose-local-template.yml',
    target: './templates/docker-compose-local.yml',
  },
  {
    template: './templates/docker-compose-local-rpvj-template.yml',
    target: './templates/docker-compose-local-rpvj.yml',
  },
  {
    template: './templates/docker-compose-client-template.yml',
    target: './templates/docker-compose-client.yml',
  },
];

const filesToBootstrapForProd = [
  {
    template: './templates/docker-compose-prod-template.yml',
    target: './templates/docker-compose-prod.yml',
  },
  {
    template: './templates/docker-compose-prod-rpvj-template.yml',
    target: './templates/docker-compose-prod-rpvj.yml',
  },
  {
    template: './templates/startProd-template.sh',
    target: './templates/startProd.sh',
  },
];

bootstrap(filesToBootstrapForLocal, bootstrapLocalValues);
bootstrap(filesToBootstrapForProd, bootstrapProdValues);

function buildBootstrapValue(target: 'local' | 'prod') {
  return {
    clientPort: environments[target].port.client,
    dbIp: environments[target].ip.db,
    dbName: environments[target].dbName,
    dbPort: environments[target].port.db,
    serverIp: environments[target].ip.server,
    serverPort: environments[target].port.server,
  };
}
