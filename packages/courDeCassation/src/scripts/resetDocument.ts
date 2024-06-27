import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import { sderConnector } from '../connector';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const { documentNumber, source } = parseArgv();
  const backend = buildBackend(settings);

  backend.runScript(
    () => sderConnector.resetDocument({ documentNumber, source, settings }),
    {
      shouldLoadDb: true,
    },
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      documentNumber: {
        demandOption: true,
        description: 'number of the document you want to reset',
        type: 'number',
      },
      source: {
        demandOption: true,
        description:
          'source (jurinet or jurica) of the document you want to reset',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    documentNumber: argv.documentNumber as number,
    source: argv.source as string,
  };
}
