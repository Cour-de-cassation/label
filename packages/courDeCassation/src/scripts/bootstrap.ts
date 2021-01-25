import { promises as fs } from 'fs';
import format from 'string-template';
import { environmentHandler } from '@label/core';

export { bootstrap };

type environmentFromFileType = {
  dbName: string;
  ip?: {
    server: string;
    db: string;
  };
  pathName: {
    server: string;
    db: string;
  };
  port: {
    server: number;
    db: number;
  };
};

bootstrap();

async function bootstrap() {
  const localEnvironment = JSON.parse(
    await fs.readFile('environments/localEnvironment.json', {
      encoding: 'utf8',
    }),
  ) as environmentFromFileType;
  const preProdEnvironment = JSON.parse(
    await fs.readFile('environments/preProdEnvironment.json', {
      encoding: 'utf8',
    }),
  ) as environmentFromFileType;
  const prodEnvironment = JSON.parse(
    await fs.readFile('environments/prodEnvironment.json', {
      encoding: 'utf8',
    }),
  ) as environmentFromFileType;

  const localDevBootstrapEnvironment = buildBootstrapEnvironment(
    localEnvironment,
    'DockerfileLocalDev',
    'LOCAL',
  );
  const localBootstrapEnvironment = buildBootstrapEnvironment(
    localEnvironment,
    'DockerfileLocal',
    'LOCAL',
  );
  const preProdBootstrapEnvironment = buildBootstrapEnvironment(
    preProdEnvironment,
    'DockerfilePreProd',
    'PREPROD',
  );
  const preProdRpvjBootstrapEnvironment = buildBootstrapEnvironment(
    preProdEnvironment,
    'DockerfilePreProdRpvj',
    'PREPROD',
  );
  const prodBootstrapEnvironment = buildBootstrapEnvironment(
    prodEnvironment,
    'DockerfileProd',
    'PROD',
  );
  const prodRpvjBootstrapEnvironment = buildBootstrapEnvironment(
    prodEnvironment,
    'DockerfileProdRpvj',
    'PROD',
  );

  const filesToBootstrapForLocalDev = [
    {
      template: './templates/docker-compose-dev-local-template.yml',
      target: './templates/docker-compose-dev-local.yml',
    },
    {
      template: './templates/docker-compose-dev-client-template.yml',
      target: './templates/docker-compose-dev-client.yml',
    },
  ];

  const filesToBootstrapForLocal = [
    {
      template: './templates/docker-compose-template.yml',
      target: './templates/docker-compose-local.yml',
    },
    {
      template: './templates/startLocal-template.sh',
      target: './templates/startLocal.sh',
    },
  ];

  const filesToBootstrapForPreProd = [
    {
      template: './templates/docker-compose-template.yml',
      target: './templates/docker-compose-pre-prod.yml',
    },
    {
      template: './templates/startPreProd-template.sh',
      target: './templates/startPreProd.sh',
    },
  ];

  const filesToBootstrapForPreProdRvpj = [
    {
      template: './templates/docker-compose-rpvj-template.yml',
      target: './templates/docker-compose-rpvj-pre-prod.yml',
    },
  ];

  const filesToBootstrapForProd = [
    {
      template: './templates/docker-compose-template.yml',
      target: './templates/docker-compose-prod.yml',
    },
    {
      template: './templates/startProd-template.sh',
      target: './templates/startProd.sh',
    },
  ];

  const filesToBootstrapForProdRpvj = [
    {
      template: './templates/docker-compose-rpvj-template.yml',
      target: './templates/docker-compose-rpvj-prod.yml',
    },
  ];

  await bootstrapFiles(
    filesToBootstrapForLocalDev,
    localDevBootstrapEnvironment,
  );
  await bootstrapFiles(filesToBootstrapForLocal, localBootstrapEnvironment);
  await bootstrapFiles(filesToBootstrapForPreProd, preProdBootstrapEnvironment);
  await bootstrapFiles(
    filesToBootstrapForPreProdRvpj,
    preProdRpvjBootstrapEnvironment,
  );
  await bootstrapFiles(filesToBootstrapForProd, prodBootstrapEnvironment);
  await bootstrapFiles(
    filesToBootstrapForProdRpvj,
    prodRpvjBootstrapEnvironment,
  );
}

function buildBootstrapEnvironment(
  environment: environmentFromFileType,
  dockerfile: string,
  RUN_MODE: 'LOCAL' | 'PREPROD' | 'PROD',
) {
  const clientPort = environmentHandler.convertServerPortToClientPort(
    environment.port.server,
  );

  return {
    clientPort,
    clientUrl: `${environment.pathName.server}:${clientPort}`,
    dbIp: environment?.ip?.db || '',
    dbName: environment.dbName,
    dbPort: environment.port.db,
    dockerfile,
    RUN_MODE,
    serverIp: environment?.ip?.server || '',
    serverPort: environment.port.server,
  };
}

async function bootstrapFiles(
  files: Array<{ template: string; target: string }>,
  env: { [key: string]: number | string },
) {
  await Promise.all(files.map(file => bootstrapFile(file, env)));
}

async function bootstrapFile(
  { template, target }: { template: string; target: string },
  env: { [key: string]: number | string },
) {
  const content = await fs.readFile(template, {
    encoding: 'utf8',
  });

  await fs.writeFile(target, format(content, env), {
    encoding: 'utf8',
  });
}
