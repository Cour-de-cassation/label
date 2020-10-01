import { userModule } from '@label/core';
import { buildUserRepository } from '../modules/user';
import { scriptRunner } from '../utils';

scriptRunner.run(insertTestUsers, { shouldLoadDb: true });

async function insertTestUsers() {
  const userRepository = buildUserRepository();

  await userRepository.insert(
    userModule.generator.generate({
      email: 'nicolas.assouad@justice.fr',
      password: 'NA',
    }),
  );
  await userRepository.insert(
    userModule.generator.generate({
      email: 'benoit.serrano@justice.fr',
      password: 'BS',
    }),
  );
}
