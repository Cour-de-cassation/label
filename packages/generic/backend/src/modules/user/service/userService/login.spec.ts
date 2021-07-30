import { dateBuilder, userModule } from '@label/core';
import { buildUserService } from './index';
import { buildUserRepository } from '../../repository';

describe('login/signUpUser', () => {
  describe('success', () => {
    it('should login and return a token', async () => {
      const userService = buildUserService();
      const userEmail = 'MAIL@MAIL.MAIL';
      const userName = 'NAME';
      const userPassword = 'PASSWORD';
      const userRole = 'admin';
      await userService.signUpUser({
        email: userEmail,
        name: userName,
        password: userPassword,
        role: userRole,
      });

      const { email, name, role, token } = await userService.login({
        email: userEmail,
        password: userPassword,
      });

      expect(email).toEqual('mail@mail.mail');
      expect(name).toEqual(userName);
      expect(role).toEqual(userRole);
      expect(token).toBeDefined;
    });
  });
  describe('failure', () => {
    it('should fail when no user has been signed up', async () => {
      const userService = buildUserService();

      const userEmail = 'MAIL@MAIL.MAIL';
      const userPassword = 'PASSWORD';

      const promise = () =>
        userService.login({
          email: userEmail,
          password: userPassword,
        });

      await expect(promise()).rejects.toThrow('Login failed');
    });
    it('should fail when only another user has been signed up', async () => {
      const userService = buildUserService();

      const userEmail = 'MAIL@MAIL.MAIL';
      const userPassword = 'PASSWORD';
      await userService.signUpUser({
        email: 'ANOTHER_MAIL@ANOTHER_MAIL.ANOTHER_MAIL',
        name: 'NAME',
        password: 'ANOTHER_PASSWORD',
      });

      const promise = () =>
        userService.login({ email: userEmail, password: userPassword });

      await expect(promise()).rejects.toThrow('Login failed');
    });
    it('should fail when the user has been signed up but the password is not the right one', async () => {
      const userService = buildUserService();

      const userEmail = 'MAIL@MAIL.MAIL';
      const userName = 'NAME';
      const userPassword = 'PASSWORD';
      const userRole = 'admin';
      await userService.signUpUser({
        email: userEmail,
        name: userName,
        password: userPassword,
        role: userRole,
      });

      const promise = () =>
        userService.login({ email: userEmail, password: 'WRONG_PASSWORD' });

      await expect(promise()).rejects.toThrow('Login failed');
    });

    it('should fail when the user has tried too many times to log in', async () => {
      const userService = buildUserService();

      const userEmail = 'MAIL@MAIL.MAIL';
      const userName = 'NAME';
      const userPassword = 'PASSWORD';
      const userRole = 'admin';
      await userService.signUpUser({
        email: userEmail,
        name: userName,
        password: userPassword,
        role: userRole,
      });
      try {
        await userService.login({
          email: userEmail,
          password: 'WRONG_PASSWORD',
        });
      } catch (error) {}

      const promise = () =>
        userService.login({ email: userEmail, password: 'WRONG_PASSWORD' });

      await expect(promise()).rejects.toThrow('Login failed');
    });

    it('should succeed when the user has only tried once with email/password', async () => {
      const userService = buildUserService();

      const userEmail = 'MAIL@MAIL.MAIL';
      const otherUserEmail = 'OTHER@MAIL.MAIL';
      const userName = 'NAME';
      const userPassword = 'PASSWORD';
      const userRole = 'admin';
      await userService.signUpUser({
        email: userEmail,
        name: userName,
        password: userPassword,
        role: userRole,
      });
      try {
        await userService.login({
          email: otherUserEmail,
          password: 'WRONG_PASSWORD',
        });
      } catch (error) {}

      const { email, passwordTimeValidityStatus } = await userService.login({
        email: userEmail,
        password: userPassword,
      });

      expect(email).toBe('mail@mail.mail');
      expect(passwordTimeValidityStatus).toBe('valid');
    });

    it('should succeed when the user has only tried once with email/password', async () => {
      const userService = buildUserService();
      const userRepository = buildUserRepository();
      const userPassword = 'password';
      const hashedPassword = await userModule.lib.computeHashedPassword(
        userPassword,
      );
      const userEmail = 'mail@mail.mail';
      const user = userModule.generator.generate({
        email: userEmail,
        hashedPassword,
        passwordLastUpdateDate: dateBuilder.monthsAgo(7),
      });
      await userRepository.insert(user);

      const { email, passwordTimeValidityStatus } = await userService.login({
        email: userEmail,
        password: userPassword,
      });

      expect(email).toBe('mail@mail.mail');
      expect(passwordTimeValidityStatus).toBe('outdated');
    });
  });
});
