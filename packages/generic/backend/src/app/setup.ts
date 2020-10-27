import { settingsLoader } from '../lib/settingsLoader';
import { mongo } from '../lib/mongo';
import { logger } from '../utils';

export { setup };

async function setup(port: number) {
  await setupSettings();
  await setupMongo(port);
}

async function setupSettings() {
  logger.log(`Loading settings...`);
  await settingsLoader.loadSettings();
  logger.log(`Settings ready!`);
}

async function setupMongo(port: number) {
  logger.log(`Loading the Mongo database...`);
  await mongo.initialize();
  logger.log(`MongoDB ready!`);
  logger.log(`GraphQL available on http://localhost:${port}`);
}
