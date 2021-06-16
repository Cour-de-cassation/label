import { settingsType } from '@label/core';
import { environmentType } from '../lib/environment';
import { buildRunScript } from './buildRunScript';
import { buildRunServer } from './buildRunServer';
import {
  clearDb,
  createMigrationFile,
  extractMonitoringEntriesIntoCsv,
  freePendingDocuments,
  insertTestUsers,
  insertUser,
  purgeDb,
  revertOneMigration,
  runNewMigrations,
} from './scripts';

export { buildBackend };

function buildBackend(environmentJson: string, settingsJson: string) {
  const environment = JSON.parse(environmentJson) as environmentType;
  const settings = JSON.parse(settingsJson) as settingsType;

  const runServer = buildRunServer(environment, settings);
  const runScript = buildRunScript(environment);

  return {
    runServer,
    runScript,
    scripts: {
      clearDb: {
        run: clearDb,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      createMigrationFile: {
        run: createMigrationFile,
        option: { shouldLoadDb: false, shouldExit: true },
      },
      extractMonitoringEntriesIntoCsv: {
        run: extractMonitoringEntriesIntoCsv,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      freePendingDocuments: {
        run: freePendingDocuments,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      insertTestUsers: {
        run: insertTestUsers,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      insertUser: {
        run: insertUser,
        option: { shouldLoadDb: true, shouldExit: false },
      },
      purgeDb: {
        run: purgeDb,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      revertOneMigration: {
        run: revertOneMigration,
        option: { shouldLoadDb: true, shouldExit: true },
      },
      runNewMigrations: {
        run: runNewMigrations,
        option: { shouldLoadDb: true, shouldExit: true },
      },
    },
  };
}
