import { settingsLoader } from '../lib/settingsLoader';
import { logger, mongo } from '../utils';

export { setup };

async function setup() {
  await setupSettings();
  await setupMongo();
}

async function setupSettings() {
  logger.log(`Loading settings...`);
  await settingsLoader.loadSettings();
  logger.log(`Settings ready!`);
}

async function setupMongo() {
  logger.log(`Loading the Mongo database...`);
  await mongo.initialize();
  logger.log(`MongoDB ready!`);
}
