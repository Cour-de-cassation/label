import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const { email, name, role } = parseArgv();
  const backend = buildBackend(settings);

  await backend.runScript(
    () => backend.scripts.insertUser.run({ email, name, role }),
    backend.scripts.insertUser.option,
  );
})();

function parseArgv() {
  const argv = yargs
    .options({
      email: {
        demandOption: true,
        description: 'Email of the new user',
        type: 'string',
      },
      name: {
        demandOption: true,
        description: 'Name of the new user',
        type: 'array',
      },
      role: {
        demandOption: true,
        description: 'Role of the new user (must be "admin" or "annotator")',
        type: 'string',
      },
    })
    .help()
    .alias('help', 'h').argv;

  if (!['admin', 'annotator'].includes(argv.role)) {
    throw new Error('Bad role');
  }

  return {
    email: argv.email as string,
    name: (argv.name as string[]).join(' '),
    role: argv.role as 'admin' | 'annotator',
  };
}
