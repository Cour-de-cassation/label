import { createMigrationFile } from './createMigrationFile';
import { runNewMigrations } from './runNewMigrations';
import { logger } from '../../../utils';

export { createMigrationFile, runDeploymentScripts, runNewMigrations };

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
}
