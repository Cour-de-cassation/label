import { assignationModule, idModule, userModule } from '@label/core';
import {
  assignationService,
  buildAssignationRepository,
} from '../../../assignation';
import { buildUserRepository } from '../../repository';
import { buildUserService } from './index';

describe('fetchUsersByAssignations', () => {
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
    const assignationsById =
      await assignationService.fetchAllAssignationsById();

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
