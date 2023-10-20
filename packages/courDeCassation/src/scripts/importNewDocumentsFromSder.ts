import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';
import { environmentType } from '@label/core';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { count } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => importNewDocumentsFromSder(count, environment), {
    shouldLoadDb: true,
  });
})();

async function importNewDocumentsFromSder(
  count: number,
  environment: environmentType,
) {
  await sderConnector.importNewDocuments({
    documentsCount: count,
    environment,
  });
}

function parseArgv() {
  const argv = yargs
    .options({
      count: {
        demandOption: true,
        description: 'number of documents you want to import',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { count: argv.count as number };
}
