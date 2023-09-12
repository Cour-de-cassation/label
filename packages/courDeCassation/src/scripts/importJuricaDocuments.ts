import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { count } = await parseArgv();
  const backend = buildBackend(environment, settings);

  backend.runScript(() => sderConnector.importJuricaDocuments(count), {
    shouldLoadDb: true,
  });
})();

async function parseArgv() {
  const argv = await yargs
    .options({
      count: {
        demandOption: true,
        description: 'number of documents you want to import',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return {
    count: argv.count as number,
  };
}
