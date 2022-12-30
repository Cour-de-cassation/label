import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { beforeMinutes } = parseArgv();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.renewCache.run({ minutes: beforeMinutes }),
    backend.scripts.renewCache.option,
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      beforeMinutes: {
        demandOption: true,
        description: 'minutes before renewing cache',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { beforeMinutes: argv.beforeMinutes as number };
}
