import { createMigrationFile } from './createMigrationFile';
import { runNewMigrations } from './runNewMigrations';
import { revertOneMigration } from './revertOneMigration';
import { logger } from '../../../utils';

export {
  createMigrationFile,
  revertOneMigration,
  runDeploymentScripts,
  runNewMigrations,
};

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
}
