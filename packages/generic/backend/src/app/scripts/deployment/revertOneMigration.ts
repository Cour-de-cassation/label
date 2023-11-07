import { idModule, migrationModule } from '@label/core';
import { migrationService } from '../../../modules/migration';
import { logger } from '../../../utils';

export { revertOneMigration };

async function revertOneMigration() {
  const lastMigration = await migrationService.fetchLastOne();

  if (!lastMigration) {
    logger.error({
      operationName: 'revertOneMigration',
      msg: `No migration to revert`,
    });
    return;
  }
  const { _id, order } = lastMigration;

  const fileName = migrationModule.lib.fileNameHandler.buildFileName({
    _id,
    order,
    extension: 'js',
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const migrationFile: {
    up: () => Promise<void>;
    down: () => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require(`./migrations/${fileName}`);

  if (
    typeof migrationFile.up === 'function' &&
    typeof migrationFile.down === 'function'
  ) {
    await migrationFile.down();
    try {
      await migrationService.deleteOne(_id);
    } catch (error) {
      await migrationFile.up();
      throw new Error(error);
    }
    logger.log({
      operationName: 'revertOneMigration',
      msg: `Migration ${idModule.lib.convertToString(
        _id,
      )} successfully reverted!`,
    });
  } else {
    throw new Error(
      `Migration file ${fileName} exists, but up or down is not a function`,
    );
  }
}
