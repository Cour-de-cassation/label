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
  const labelDbUrl = process.env.LABEL_DB_URL;
  const labelDbName = process.env.LABEL_DB_NAME;
  logger.log({
    operationName: 'setupMongo',
    msg: `Loading the Mongo database : ${labelDbName}`,
  });
  if (labelDbUrl == undefined || labelDbName == undefined) {
    throw new Error('You must provide a valid database URL and name.');
  }
  await mongo.initialize({
    dbName: labelDbName,
    url: labelDbUrl,
  });
  logger.log({ operationName: 'setupMongo', msg: `MongoDB ready!` });

  logger.log({
    operationName: 'setupMongo',
    msg: 'Set indexes on all collections',
  });
  await setIndexesOnAllCollections();
  logger.log({ operationName: 'setupMongo', msg: 'Indexation done' });
}
