import yargs from 'yargs';
import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const { email, name, password, role } = await parseArgv();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.insertUser.run({ email, name, password, role }),
    backend.scripts.insertUser.option,
  );
})();

async function parseArgv() {
  const argv = await yargs
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
      password: {
        demandOption: true,
        description: 'Password of the new user',
        type: 'string',
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
    name: (argv.name as string[]).join(' ') as string,
    password: argv.password as string,
    role: argv.role as 'admin' | 'annotator',
  };
}
