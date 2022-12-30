import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { documentNumber, source } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => backend.scripts.dumpDocument.run(documentNumber, source),
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
        description: 'number of the document you want to dump',
        type: 'number',
      },
      source: {
        demandOption: true,
        description:
          'source (jurinet or jurica) of the document you want to dump',
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
