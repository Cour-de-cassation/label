import { assignationModule, idModule, userModule } from '@label/core';
import {
  assignationService,
  buildAssignationRepository,
} from '../../assignation';
import { buildUserRepository } from '../repository';
import { buildUserService } from './userService';

describe('userService', () => {
  describe('changePassword', () => {
    it('should change the password of the given user', async () => {
      const userService = buildUserService();
      const userRepository = buildUserRepository();
      const userEmail = 'MAIL@MAIL.MAIL';
      const userName = 'NAME';
      const userPassword = userModule.lib.passwordHandler.generate();
      const userNewPassword = userModule.lib.passwordHandler.generate();
      const userRole = 'admin';
      await userService.signUpUser({
        email: userEmail,
        name: userName,
        password: userPassword,
        role: userRole,
      });
      const user = await userRepository.findByEmail(userEmail);

      const result = await userService.changePassword({
        user,
        previousPassword: userPassword,
        newPassword: userNewPassword,
      });

      const { email, name, role, token } = await userService.login({
        email: userEmail,
        password: userNewPassword,
      });
      expect(result).toEqual('passwordUpdated');
      expect(email).toEqual('mail@mail.mail');
      expect(name).toEqual(user.name);
      expect(role).toEqual(user.role);
      expect(token).toBeDefined;
    });

    it('should not change the password of the given user if the previous password is wrong', async () => {
      const userService = buildUserService();
      const userRepository = buildUserRepository();
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
      const user = await userRepository.findByEmail(userEmail);

      const result = await userService.changePassword({
        user,
        previousPassword: 'WRONG_PASSWORD',
        newPassword: 'NEW_PASSWORD',
      });

      const { email, name, role, token } = await userService.login({
        email: userEmail,
        password: userPassword,
      });
      expect(result).toEqual('wrongPassword');
      expect(email).toEqual('mail@mail.mail');
      expect(name).toEqual(user.name);
      expect(role).toEqual(user.role);
      expect(token).toBeDefined;
    });

    it('should not change the password of the given user if the new password is not valid (less than 8 characters)', async () => {
      const userService = buildUserService();
      const userRepository = buildUserRepository();
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
      const user = await userRepository.findByEmail(userEmail);

      const result = await userService.changePassword({
        user,
        previousPassword: 'PASSWORD',
        newPassword: 'P',
      });

      const { email, name, role, token } = await userService.login({
        email: userEmail,
        password: userPassword,
      });
      expect(result).toEqual('notValidNewPassword');
      expect(email).toEqual('mail@mail.mail');
      expect(name).toEqual(user.name);
      expect(role).toEqual(user.role);
      expect(token).toBeDefined;
    });

    it('should not change the password of the given user if the new password is not changed', async () => {
      const userService = buildUserService();
      const userRepository = buildUserRepository();
      const userEmail = 'MAIL@MAIL.MAIL';
      const userName = 'NAME';
      const userPassword = userModule.lib.passwordHandler.generate();
      const userRole = 'admin';
      await userService.signUpUser({
        email: userEmail,
        name: userName,
        password: userPassword,
        role: userRole,
      });
      const user = await userRepository.findByEmail(userEmail);

      const result = await userService.changePassword({
        user,
        previousPassword: userPassword,
        newPassword: userPassword,
      });

      const { email, name, role, token } = await userService.login({
        email: userEmail,
        password: userPassword,
      });
      expect(result).toEqual('notValidNewPassword');
      expect(email).toEqual('mail@mail.mail');
      expect(name).toEqual(user.name);
      expect(role).toEqual(user.role);
      expect(token).toBeDefined;
    });
  });

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

        const { email } = await userService.login({
          email: userEmail,
          password: userPassword,
        });

        expect(email).toBe('mail@mail.mail');
      });
    });
  });

  describe('fetchUserNamesByAssignationId', () => {
    it('should return userNames mapped by assignationId', async () => {
      const userService = buildUserService();

      const assignationRepository = buildAssignationRepository();
      const userRepository = buildUserRepository();
      const [user1, user2] = ['Nicolas', 'Benoit'].map((name) =>
        userModule.generator.generate({ name }),
      );
      const [assignation1, assignation2] = [user1, user2].map((user) =>
        assignationModule.generator.generate({ userId: user._id }),
      );
      await userRepository.insert(user1);
      await userRepository.insert(user2);
      await assignationRepository.insert(assignation1);
      await assignationRepository.insert(assignation2);
      const assignationsById = await assignationService.fetchAllAssignationsById();

      const userNamesByAssignationId = await userService.fetchUsersByAssignations(
        Object.values(assignationsById),
      );
      expect(
        userNamesByAssignationId[idModule.lib.convertToString(assignation1._id)]
          .name,
      ).toEqual('Nicolas');
      expect(
        userNamesByAssignationId[idModule.lib.convertToString(assignation2._id)]
          .name,
      ).toEqual('Benoit');
    });
  });
});
