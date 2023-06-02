import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import { sderConnector } from '../connector';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { days } = await parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => resetAllDocumentsSince(days), {
    shouldLoadDb: true,
  });
})();

async function resetAllDocumentsSince(days: number) {
  await sderConnector.resetAllDocumentsSince(days);
}

async function parseArgv() {
  const argv = await yargs
    .options({
      days: {
        demandOption: true,
        description: 'imported since days',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { days: argv.days as number };
}
