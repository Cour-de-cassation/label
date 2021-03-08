import { assignationModule, idModule, userModule } from '@label/core';
import {
  assignationService,
  buildAssignationRepository,
} from '../../assignation';
import { buildUserRepository } from '../repository';
import { userService } from './userService';

describe('userService', () => {
  describe('login/signUpUser', () => {
    describe('success', () => {
      it('should login and return a token', async () => {
        const user = userModule.generator.generate({
          email: 'MAIL@MAIL.MAIL',
          name: 'NAME',
          password: 'PASSWORD',
          role: 'admin',
        });
        await userService.signUpUser(user);

        const { email, name, role, token } = await userService.login(user);

        expect(email).toEqual('mail@mail.mail');
        expect(name).toEqual(user.name);
        expect(role).toEqual(user.role);
        expect(token).toBeDefined;
      });
    });
    describe('failure', () => {
      it('should fail when no user has been signed up', async () => {
        const user = {
          email: 'MAIL@MAIL.MAIL',
          name: 'NAME',
          password: 'PASSWORD',
        };

        const promise = () => userService.login(user);

        await expect(promise()).rejects.toThrow(
          `No matching user for email ${user.email}`,
        );
      });
      it('should fail when only another user has been signed up', async () => {
        const user = {
          email: 'MAIL@MAIL.MAIL',
          name: 'NAME',
          password: 'PASSWORD',
        };
        await userService.signUpUser({
          email: 'ANOTHER_MAIL@ANOTHER_MAIL.ANOTHER_MAIL',
          name: 'NAME',
          password: 'ANOTHER_PASSWORD',
        });

        const promise = () => userService.login(user);

        await expect(promise()).rejects.toThrow(
          `No matching user for email ${user.email}`,
        );
      });
      it('should fail when the user has been signed up but the password is not the right one', async () => {
        const user = {
          email: 'MAIL@MAIL.MAIL',
          name: 'NAME',
          password: 'PASSWORD',
        };
        await userService.signUpUser({
          email: 'MAIL@MAIL.MAIL',
          name: 'NAME',
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

  describe('fetchUserNamesByAssignationId', () => {
    it('should return userNames mapped by assignationId', async () => {
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

      const userNamesByAssignationId = await userService.fetchUserNamesByAssignationId(
        assignationsById,
      );
      expect(
        userNamesByAssignationId[
          idModule.lib.convertToString(assignation1._id)
        ],
      ).toEqual('Nicolas');
      expect(
        userNamesByAssignationId[
          idModule.lib.convertToString(assignation2._id)
        ],
      ).toEqual('Benoit');
    });
  });
});
