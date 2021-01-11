import { userService } from '../modules/user';
import { scriptRunner } from '../utils';

scriptRunner.run(insertTestUsers, { shouldLoadDb: true });

async function insertTestUsers() {
  await userService.signUpUser({
    email: 'nicolas.assouad@justice.fr',
    password: 'NA',
    role: 'admin',
  });
  await userService.signUpUser({
    email: 'benoit.serrano@justice.fr',
    password: 'BS',
    role: 'admin',
  });
}
