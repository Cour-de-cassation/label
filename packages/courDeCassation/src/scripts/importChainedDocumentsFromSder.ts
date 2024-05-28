import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const { count, threshold } = parseArgv();
  const backend = buildBackend(settings);

  backend.runScript(
    () => importChainedDocumentsFromSder({ count, threshold }),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importChainedDocumentsFromSder({
  count,
  threshold,
}: {
  count: number;
  threshold: number;
}) {
  await sderConnector.importChainedDocumentsFromSder({
    documentsCount: count,
    threshold,
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
