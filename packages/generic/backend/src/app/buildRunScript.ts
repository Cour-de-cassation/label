import { environmentType } from '@label/core';
import { logger, mongo } from '../utils';
import { setupMongo } from './setup';

export { buildRunScript };

function buildRunScript(
  environment: environmentType,
): (
  script: () => Promise<void>,
  { shouldLoadDb }: { shouldLoadDb: boolean; shouldExit?: boolean },
) => Promise<void> {
  return async (script, { shouldLoadDb, shouldExit = true }) => {
    if (shouldLoadDb) {
      await runScriptWithDb();
    } else {
      await script();
    }

    if (shouldExit) {
      process.exit(0);
    }

    async function runScriptWithDb() {
      logger.log(`Running script with ${environment}`);

      await setupMongo(environment);

      await script();

      logger.log(`Closing connection with MongoDb...`);
      await mongo.close();
      logger.log(`MongoDb connection closed!`);
    }
  };
}
