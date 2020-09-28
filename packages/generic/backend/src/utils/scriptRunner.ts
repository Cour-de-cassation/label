import { mongo } from '../lib/mongo';
import { logger } from './logger';

export { scriptRunner };

const scriptRunner = {
  async run(
    script: () => Promise<void>,
    { shouldLoadDb }: { shouldLoadDb: boolean },
  ): Promise<void> {
    if (shouldLoadDb) {
      logger.log(`Connecting to the MongoDb...`);
      await mongo.initialize();
      logger.log(`MongoDB ready!`);
    }

    await script();
  },
};
