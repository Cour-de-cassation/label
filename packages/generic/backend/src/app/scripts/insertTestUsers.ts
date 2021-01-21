import { userService } from '../../modules/user';

export { insertTestUsers };

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
