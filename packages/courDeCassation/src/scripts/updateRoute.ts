import yargs, { string } from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import { documentType } from '@label/core';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { status } = parseArgv();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.updateRoute.run(status),
    backend.scripts.updateRoute.option,
  );
})();


function parseArgv() {
  const argv = yargs
    .option({
      status: {
        demandOption: true,
        description: 'status of the document you want to update route',
        type: 'string',
      }
    })
    .help()
    .alias('help', 'h').argv;

  return {
    status: argv.status as documentType['status'],
  }
}
