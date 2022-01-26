import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { from, to, jurisdictions } = parseArgv();
  const backend = buildBackend(environment, settings);

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const jurisdictionsArr = jurisdictions ? jurisdictions.split(',') : [];

  backend.runScript(
    () => importAllDocumentsFromSderBetween(fromDate, toDate, jurisdictionsArr),
    {
      shouldLoadDb: true,
    },
  );
})();

async function importAllDocumentsFromSderBetween(
  from: Date,
  to: Date,
  jurisdictions: string[],
) {
  await sderConnector.importDocumentsByJurisdictionBetween(
    from,
    to,
    jurisdictions,
  );
}

function parseArgv() {
  const argv = yargs
    .options({
      from: {
        demandOption: true,
        description: 'the first bounding date (YYYY-MM-DD)',
        type: 'string',
      },
      to: {
        demandOption: true,
        description: 'the last bounding date (YYYY-MM-DD)',
        type: 'string',
      },
      jurisdictions: {
        demandOption: false,
        description: 'jurisdictions to filter',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    from: argv.from as string,
    to: argv.to as string,
    jurisdictions: argv.jurisdictions as string,
  };
}
