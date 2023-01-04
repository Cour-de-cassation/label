import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { days } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => importAllDocumentsFromSder(days), {
    shouldLoadDb: true,
  });
})();

async function importAllDocumentsFromSder(days: number) {
  await sderConnector.importDocumentsSinceDateCreation(days);
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
