import { settingsType } from '@label/core';
import { environmentType } from '../lib/environment';
import { buildRunScript } from './buildRunScript';
import { buildRunServer } from './buildRunServer';
import { clearDb, insertTestUsers } from './scripts';

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
      clearDb: () => runScript(clearDb, { shouldLoadDb: true }),
      insertTestUsers: () => runScript(insertTestUsers, { shouldLoadDb: true }),
    },
  };
}
