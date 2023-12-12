import { environmentType, settingsType } from '@label/core';
import { settingsLoader } from '../lib/settingsLoader';
import { logger, mongo } from '../utils';
import { setIndexesOnAllCollections } from './scripts';

export { setup, setupMongo };

async function setup(environment: environmentType, settings: settingsType) {
  setupSettings(settings);
  await setupMongo(environment);
}

function setupSettings(settings: settingsType) {
  settingsLoader.setSettings(settings);
  logger.log({ operationName: 'setupSettings', msg: `Settings ready!` });
}

async function setupMongo(environment: environmentType) {
  const url = process.env.MONGODB_URL ?? `${environment.pathName.db}:${environment.port.db}`;
  logger.log({
    operationName: 'setupMongo',
    msg: `Loading the Mongo database : ${environment.dbName}`,
  });
  await mongo.initialize({
    dbName: environment.dbName,
    url: url,
  });
  logger.log({ operationName: 'setupMongo', msg: `MongoDB ready!` });

  logger.log({
    operationName: 'setupMongo',
    msg: 'Set indexes on all collections',
  });
  await setIndexesOnAllCollections();
  logger.log({ operationName: 'setupMongo', msg: 'Indexation done' });
}
