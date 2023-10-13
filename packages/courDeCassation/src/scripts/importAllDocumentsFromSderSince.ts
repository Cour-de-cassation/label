import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';
import { environmentType } from '@label/core';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { days } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => importAllDocumentsFromSder(days, environment), {
    shouldLoadDb: true,
  });
})();

async function importAllDocumentsFromSder(
  days: number,
  environment: environmentType,
) {
  await sderConnector.importDocumentsSinceDateCreation(days, environment);
}

function parseArgv() {
  const argv = yargs
    .options({
      days: {
        demandOption: true,
        description: 'created since days',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { days: argv.days as number };
}
