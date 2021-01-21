import { settingsType } from '@label/core';
import { environmentType } from '../lib/environment';
import { settingsLoader } from '../lib/settingsLoader';
import { logger, mongo } from '../utils';

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
  logger.log(`Loading the Mongo database...`);
  await mongo.initialize({
    dbName: environment.dbName,
    url: `${environment.pathName.db}:${environment.port.db}`,
  });
  logger.log(`MongoDB ready!`);
}
