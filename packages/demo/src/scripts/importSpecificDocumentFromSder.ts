import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { documentNumber, source, forceRequestRoute } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () =>
      sderConnector.importSpecificDocument({
        documentNumber,
        source,
        forceRequestRoute,
      }),
    {
      shouldLoadDb: true,
    },
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      forceRequestRoute: {
        demandOption: false,
        description: "should change the route to 'request'",
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
    forceRequestRoute: !!argv.forceRequestRoute as boolean,
    source: argv.source as string,
  };
}
