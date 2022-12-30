import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { beforeMonths } = parseArgv();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.purgeDb.run({ months: beforeMonths }),
    backend.scripts.purgeDb.option,
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      beforeMonths: {
        demandOption: true,
        description: 'months before purging',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { beforeMonths: argv.beforeMonths as number };
}
