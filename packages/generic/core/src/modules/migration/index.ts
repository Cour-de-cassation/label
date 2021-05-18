import { migrationGenerator } from './generator';
import { migrationModel, migrationType } from './migrationType';
import { buildMigration, fileNameHandler } from './lib';

export { migrationModule };

export type { migrationType };

const migrationModule = {
  model: migrationModel,
  generator: migrationGenerator,
  lib: {
    buildMigration,
    fileNameHandler,
  },
};
