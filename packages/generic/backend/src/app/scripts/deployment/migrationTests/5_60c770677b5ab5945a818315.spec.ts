import { omit } from 'lodash';
import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../../../modules/user';
import { up, down } from '../migrations/5_60c770677b5ab5945a818315';

describe('add deletionDate in user model', () => {
  const usersWithNewModel = [
    userModule.generator.generate({
      deletionDate: undefined,
    }),
    userModule.generator.generate({
      deletionDate: undefined,
    }),
    userModule.generator.generate({
      deletionDate: undefined,
    }),
  ];
  const usersWithOldModel = [
    omit(usersWithNewModel[0], 'deletionDate'),
    omit(usersWithNewModel[1], 'deletionDate'),
    omit(usersWithNewModel[2], 'deletionDate'),
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
