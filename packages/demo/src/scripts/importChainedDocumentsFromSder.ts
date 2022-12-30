import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { threshold, count } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => importChainedDocumentsFromSder(threshold, count), {
    shouldLoadDb: true,
  });
})();

async function importChainedDocumentsFromSder(
  threshold: number,
  count: number,
) {
  await sderConnector.importChainedDocumentsFromSder(threshold, count);
}

function parseArgv() {
  const argv = yargs
    .options({
      threshold: {
        demandOption: true,
        description:
          'free documents count below which you want to launch a document import',
        type: 'number',
      },
      count: {
        demandOption: true,
        description: 'number of documents you want to import',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { threshold: argv.threshold as number, count: argv.count as number };
}
