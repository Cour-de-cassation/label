import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import { sderConnector } from '../connector';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { days, source } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => sderConnector.deleteDocumentsOlderThan({ days, source }),
    {
      shouldLoadDb: true,
    },
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      days: {
        demandOption: true,
        description: 'days below which you want to delete all documents',
        type: 'number',
      },
      source: {
        demandOption: true,
        description:
          'source (jurinet or jurica) of the document you want to delete',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    days: argv.days as number,
    source: argv.source as string,
  };
}
