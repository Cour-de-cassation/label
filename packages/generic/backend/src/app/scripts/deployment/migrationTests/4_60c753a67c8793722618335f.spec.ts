import { omit } from 'lodash';
import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../../../modules/user';
import { up, down } from '../migrations/4_60c753a67c8793722618335f';

describe('add isActivated in user model', () => {
  const usersWithNewModel = [
    userModule.generator.generate({
      isActivated: true,
    }),
    userModule.generator.generate({
      isActivated: true,
    }),
    userModule.generator.generate({
      isActivated: true,
    }),
  ];
  const usersWithOldModel = [
    omit(usersWithNewModel[0], 'isActivated'),
    omit(usersWithNewModel[1], 'isActivated'),
    omit(usersWithNewModel[2], 'isActivated'),
  ];

  it('should test up', async () => {
    const userRepository = buildUserRepository();
    await Promise.all(
      ((usersWithOldModel as any) as userType[]).map(userRepository.insert),
    );

    await up();

    const usersAfterUpdateModel = await userRepository.findAll();
    expect(usersAfterUpdateModel.sort()).toEqual(usersWithNewModel.sort());
  });

  it('should test down', async () => {
    const userRepository = buildUserRepository();
    await Promise.all(usersWithNewModel.map(userRepository.insert));

    await down();

    const usersAfterUpdateModel = await userRepository.findAll();
    expect(usersAfterUpdateModel.sort()).toEqual(usersWithOldModel.sort());
  });
});
