import { idModule, migrationModule } from '@label/core';
import { migrationService } from '../../../modules/migration';
import { fileSystem, logger } from '../../../utils';
import { getPathToMigrationFolder } from './getPathToMigrationFolder';

export { runNewMigrations };

async function runNewMigrations() {
  const pathToMigrationFolder = getPathToMigrationFolder();

  const fileNames = await fileSystem.listFilesOfDirectory(
    pathToMigrationFolder,
  );
  const sortedFileNames = migrationModule.lib.fileNameHandler.sortFileNames(
    fileNames,
    'asc',
  );

  const alreadyRunMigrations = await migrationService.fetchAll();
  logger.log({
    operationName: 'runNewMigrations',
    msg: `${alreadyRunMigrations.length} migrations in the database`,
  });
  logger.log({
    operationName: 'runNewMigrations',
    msg: `${fileNames.length} migrations locally stored`,
  });
  for (const fileName of sortedFileNames) {
    const { _id, order } = migrationModule.lib.fileNameHandler.parseFileName(
      fileName,
    );

    if (
      !alreadyRunMigrations.some((migration) =>
        idModule.lib.equalId(migration._id, _id),
      )
    ) {
      logger.log({
        operationName: 'runNewMigrations',
        msg: `Executing migration ${idModule.lib.convertToString(_id)}...`,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const migrationFile: {
        up: () => Promise<void>;
        down: () => Promise<void>;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
      } = require(`./migrations/${migrationModule.lib.fileNameHandler.buildFileName(
        { _id, order, extension: 'js' },
      )}`);
      if (
        typeof migrationFile.up === 'function' &&
        typeof migrationFile.down === 'function'
      ) {
        await migrationFile.up();
        try {
          await migrationService.createOne({ _id, order });
        } catch (error) {
          await migrationFile.down();
          throw new Error(error);
        }
        logger.log({
          operationName: 'runNewMigrations',
          msg: `Migration ${idModule.lib.convertToString(
            _id,
          )} successfully executed!`,
        });
      } else {
        throw new Error(
          `Migration file ${fileName} exists, but up or down is not a function`,
        );
      }
    }
  }
}
