import { userService } from '../../modules/user';

export { insertTestUsers };

async function insertTestUsers() {
  await userService.signUpUser({
    email: 'nicolas.assouad@justice.fr',
    name: 'Nicolas Assouad',
    password: 'NA',
    role: 'admin',
  });
  await userService.signUpUser({
    email: 'benoit.serrano@justice.fr',
    name: 'Benoit Serrano',
    password: 'BS',
    role: 'admin',
  });
}
