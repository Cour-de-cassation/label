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
  await userService.signUpUser({
    email: 'harald.achille@justice.fr',
    name: 'Harald Achille',
    password: 'HA',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'franka.hochet@justice.fr',
    name: 'Franka Hochet',
    password: 'FH',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'luka.krampon@justice.fr',
    name: 'Luka Krampon',
    password: 'LK',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'calvin.talon@justice.fr',
    name: 'Calvin Talon',
    password: 'CT',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'natacha.blake@justice.fr',
    name: 'Natacha Blake',
    password: 'NB',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'felicia.dubois@justice.fr',
    name: 'Félicia Dubois',
    password: 'FD',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'corinne.dedou@justice.fr',
    name: 'Corinne Dédou',
    password: 'CD',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'cedric.spring@justice.fr',
    name: 'Cédric Spring',
    password: 'CS',
    role: 'annotator',
  });
}
