import { userService } from '../../modules/user';

export { insertTestUsers };

async function insertTestUsers() {
  await userService.signUpUser({
    email: 'test.annotator@label.fr',
    name: 'Test Annotator',
    password: 'annotator',
    role: 'annotator',
  });
  await userService.signUpUser({
    email: 'test.scrutator@label.fr',
    name: 'Test Scrutator',
    password: 'scrutator',
    role: 'scrutator',
  });
  await userService.signUpUser({
    email: 'test.admin@label.fr',
    name: 'Test Admin',
    password: 'admin',
    role: 'admin',
  });
}
