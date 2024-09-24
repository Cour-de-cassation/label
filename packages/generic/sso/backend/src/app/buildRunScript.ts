import { logger, mongo } from '../utils';
import { setupMongo } from './setup';

export { buildRunScript };

function buildRunScript(): (
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
      await setupMongo();

      await script();

      logger.log({
        operationName: 'runScriptWithDb',
        msg: `Closing connection with MongoDb...`,
      });
      await mongo.close();
      logger.log({
        operationName: 'runScriptWithDb',
        msg: `MongoDb connection closed!`,
      });
    }
  };
}
