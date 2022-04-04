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
  logger.log(`Settings ready!`);
}

async function setupMongo(environment: environmentType) {
  const url = `${environment.pathName.db}:${environment.port.db}`;
  logger.log(`Loading the Mongo database, url ${url} ${environment.dbName}`);
  await mongo.initialize({
    dbName: environment.dbName,
    url: url,
  });
  logger.log(`MongoDB ready!`);

  logger.log('Set indexes on all collections');
  await setIndexesOnAllCollections();
  logger.log('Indexation done');
}
