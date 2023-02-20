import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { documentNumber, source, lowPriority } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () =>
      sderConnector.importSpecificDocument({
        documentNumber,
        source,
        lowPriority,
      }),
    {
      shouldLoadDb: true,
    },
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      lowPriority: {
        demandOption: false,
        description: "import without 'request' route and priority 4",
        type: 'boolean',
      },
      documentNumber: {
        demandOption: true,
        description: 'number of the document you want to import',
        type: 'number',
      },
      source: {
        demandOption: true,
        description:
          'source (jurinet or jurica) of the document you want to import',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    documentNumber: argv.documentNumber as number,
    lowPriority: !!argv.lowPriority as boolean,
    source: argv.source as string,
  };
}
