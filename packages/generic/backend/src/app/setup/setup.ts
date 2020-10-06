import { anonymizationSettings } from '../../lib/anonymizationSettings';
import { mongo } from '../../lib/mongo';
import { logger } from '../../utils';

export { setup };

async function setup(port: number) {
  await setupAnonymizationSettings();
  await setupMongo(port);
}

async function setupAnonymizationSettings() {
  logger.log(`Loading anonymization settings...`);
  await anonymizationSettings.loadAnonymizationSettings();
  logger.log(`Anonymization settings ready!`);
}

async function setupMongo(port: number) {
  logger.log(`Loading the Mongo database...`);
  await mongo.initialize();
  logger.log(`MongoDB ready!`);
  logger.log(`GraphQL available on http://localhost:${port}`);
}
