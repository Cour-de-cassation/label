import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const {
    documentNumber,
    source,
    lowPriority,
    keepLabelTreatments,
  } = parseArgv();
  const backend = buildBackend(settings);

  backend.runScript(
    () =>
      sderConnector.importSpecificDocument({
        documentNumber,
        source,
        lowPriority,
        keepLabelTreatments,
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
          'source (jurinet, jurica or juritj) of the document you want to import',
        type: 'string',
      },
      keepLabelTreatments: {
        demandOption: false,
        description: 'import labelTreatments from SDER database if exist',
        type: 'boolean',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    documentNumber: argv.documentNumber as number,
    lowPriority: !!argv.lowPriority as boolean,
    source: argv.source as string,
    keepLabelTreatments: !!argv.keepLabelTreatments as boolean,
  };
}
