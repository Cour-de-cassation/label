import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';
import { environmentType } from '@label/core';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { count, threshold } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => importChainedDocumentsFromSder({ count, threshold, environment }),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importChainedDocumentsFromSder({
  count,
  threshold,
  environment,
}: {
  count: number;
  threshold: number;
  environment: environmentType;
}) {
  await sderConnector.importChainedDocumentsFromSder({
    documentsCount: count,
    threshold,
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
      threshold: {
        demandOption: true,
        description:
          'free documents count below which you want to launch a document import',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { count: argv.count as number, threshold: argv.threshold as number };
}
