import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { documentNumber, source } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => importSpecificDocumentFromSder({ documentNumber, source }),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importSpecificDocumentFromSder({
  documentNumber,
  source,
}: {
  documentNumber: number;
  source: string;
}) {
  await sderConnector.importSpecificDocument({ documentNumber, source });
}

function parseArgv() {
  const argv = yargs
    .options({
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
    source: argv.source as string,
  };
}
