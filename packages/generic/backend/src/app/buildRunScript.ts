import { environmentType } from '../lib/environment';
import { logger, mongo } from '../utils';
import { setupMongo } from './setup';

export { buildRunScript };

function buildRunScript(
  environment: environmentType,
): (
  script: () => Promise<void>,
  { shouldLoadDb }: { shouldLoadDb: boolean },
) => Promise<void> {
  return async (script, { shouldLoadDb }) => {
    if (shouldLoadDb) {
      await runScriptWithDb();
    } else {
      await script();
    }

    async function runScriptWithDb() {
      await setupMongo(environment);

      await script();

      logger.log(`Closing connection with MongoDb...`);
      await mongo.close();
      logger.log(`MongoDb connection closed!`);
    }
  };
}
