import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { documentNumber, source } = parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => extractDocumentAndNlpAnnotations({ documentNumber, source }),
    {
      shouldLoadDb: true,
    },
  );
})();

async function extractDocumentAndNlpAnnotations({
  documentNumber,
  source,
}: {
  documentNumber: number;
  source: string;
}) {
  await sderConnector.extractDocumentAndNlpAnnotations({
    documentNumber,
    source,
    folder: './extractions',
  });
}

function parseArgv() {
  const argv = yargs
    .options({
      documentNumber: {
        demandOption: true,
        description: 'number of the document you want to extract',
        type: 'number',
      },
      source: {
        demandOption: true,
        description:
          'source (jurinet or jurica) of the document you want to extract',
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
