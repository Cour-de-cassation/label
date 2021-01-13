import { userService } from './userService';

describe('userService', () => {
  describe('login/signUpUser', () => {
    describe('success', () => {
      it('should login and return a token', async () => {
        const user = { email: 'MAIL@MAIL.MAIL', password: 'PASSWORD' };
        await userService.signUpUser({
          email: 'MAIL@MAIL.MAIL',
          password: 'PASSWORD',
        });

        const token = await userService.login(user);

        expect(token).toBeDefined;
      });
    });
    describe('failure', () => {
      it('should fail when no user has been signed up', async () => {
        const user = { email: 'MAIL@MAIL.MAIL', password: 'PASSWORD' };

        const promise = () => userService.login(user);

        await expect(promise()).rejects.toThrow(
          `No matching user for email ${user.email}`,
        );
      });
      it('should fail when only another user has been signed up', async () => {
        const user = { email: 'MAIL@MAIL.MAIL', password: 'PASSWORD' };
        await userService.signUpUser({
          email: 'ANOTHER_MAIL@ANOTHER_MAIL.ANOTHER_MAIL',
          password: 'ANOTHER_PASSWORD',
        });

        const promise = () => userService.login(user);

        await expect(promise()).rejects.toThrow(
          `No matching user for email ${user.email}`,
        );
      });
      it('should fail when the user has been signed up but the password is not the right one', async () => {
        const user = { email: 'MAIL@MAIL.MAIL', password: 'PASSWORD' };
        await userService.signUpUser({
          email: 'MAIL@MAIL.MAIL',
          password: 'PASSWORD',
        });

        const promise = () =>
          userService.login({ ...user, password: 'WRONG_PASSWORD' });

        await expect(promise()).rejects.toThrow(
          `The received password does not match the stored one for ${user.email}`,
        );
      });
    });
  });
});
