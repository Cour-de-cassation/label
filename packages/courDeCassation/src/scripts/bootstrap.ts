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

  const localDevBootstrapEnvironment =
    buildBootstrapEnvironment(localEnvironment);
  const localBootstrapEnvironment = buildBootstrapEnvironment(localEnvironment);
  const preProdBootstrapEnvironment =
    buildBootstrapEnvironment(preProdEnvironment);
  const prodBootstrapEnvironment = buildBootstrapEnvironment(prodEnvironment);

  const filesToBootstrapForLocalDev = [
    {
      template: './templates/docker-compose-dev-template.yml',
      target: './templates/docker-compose-dev.yml',
    },
    {
      template: './templates/docker-compose-dev-client-template.yml',
      target: './templates/docker-compose-dev-client.yml',
    },
  ];

  const filesToBootstrapForLocal = [
    {
      template: './templates/docker-compose-template.yml',
      target: './templates/docker-compose.yml',
    },
    {
      template: './templates/startLocal-template.sh',
      target: './templates/startLocal.sh',
    },
  ];

  const filesToBootstrapForPreProd = [
    {
      template: './templates/startPreProd-template.sh',
      target: './templates/startPreProd.sh',
    },
  ];

  const filesToBootstrapForProd = [
    {
      template: './templates/startProd-template.sh',
      target: './templates/startProd.sh',
    },
  ];

  await bootstrapFiles(
    filesToBootstrapForLocalDev,
    localDevBootstrapEnvironment,
  );
  await bootstrapFiles(filesToBootstrapForLocal, localBootstrapEnvironment);
  await bootstrapFiles(filesToBootstrapForPreProd, preProdBootstrapEnvironment);
  await bootstrapFiles(filesToBootstrapForProd, prodBootstrapEnvironment);
}

function buildBootstrapEnvironment(environment: environmentFromFileType) {
  const clientPort = environmentHandler.convertServerPortToClientPort(
    environment.port.server,
  );

  return {
    clientPort,
    dbName: environment.dbName,
    dbPort: environment.port.db,
    serverPort: environment.port.server,
  };
}

async function bootstrapFiles(
  files: Array<{ template: string; target: string }>,
  env: { [key: string]: number | string },
) {
  await Promise.all(files.map((file) => bootstrapFile(file, env)));
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
