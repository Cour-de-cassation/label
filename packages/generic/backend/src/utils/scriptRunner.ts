import { mongo } from '../lib/mongo';
import { logger } from './logger';

export { scriptRunner };

const scriptRunner = {
  async run(
    script: () => Promise<void>,
    { shouldLoadDb }: { shouldLoadDb: boolean },
  ): Promise<void> {
    if (shouldLoadDb) {
      await runScriptWithDb(script);
    } else {
      await runScript(script);
    }
  },
};

async function runScriptWithDb(script: () => Promise<void>) {
  logger.log(`Connecting to the MongoDb...`);
  await mongo.initialize();
  logger.log(`MongoDB ready!`);

  await runScript(script);

  logger.log(`Closing connection with MongoDb...`);
  await mongo.close();
  logger.log(`MongoDb connection closed!`);
}

async function runScript(script: () => Promise<void>) {
  await script();
}
