import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { sinceMinutes } = parseArgv();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.freePendingDocuments.run(sinceMinutes),
    backend.scripts.insertUser.option,
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      sinceMinutes: {
        demandOption: true,
        description: 'minutes before freeing',
        type: 'number',
      },
    })
    .help()
    .alias('help', 'h').argv;

  return { sinceMinutes: argv.sinceMinutes as number };
}
