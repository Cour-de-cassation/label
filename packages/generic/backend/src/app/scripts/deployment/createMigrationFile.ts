import { idModule, migrationModule } from '@label/core';
import { fileSystem } from '../../../utils';
import { getPathToMigrationFolder } from './getPathToMigrationFolder';
import { emptyMigration } from './emptyMigration';

export { createMigrationFile };

async function createMigrationFile() {
  const _id = idModule.lib.buildId();
  const pathToMigrationFolder = getPathToMigrationFolder();
  const fileNames = await fileSystem.listFilesOfDirectory(
    pathToMigrationFolder,
  );
  const sortedFileNames = migrationModule.lib.fileNameHandler.sortFileNames(
    fileNames,
    'desc',
  );

  const newMigrationOrder =
    sortedFileNames.length > 0
      ? migrationModule.lib.fileNameHandler.parseFileName(sortedFileNames[0])
          .order + 1
      : 0;
  const newMigrationFileName =
    migrationModule.lib.fileNameHandler.buildFileName({
      _id,
      order: newMigrationOrder,
      extension: 'ts',
    });
  const filePath = `${getPathToMigrationFolder()}/${newMigrationFileName}`;

  await fileSystem.createFile(filePath, emptyMigration);
}
