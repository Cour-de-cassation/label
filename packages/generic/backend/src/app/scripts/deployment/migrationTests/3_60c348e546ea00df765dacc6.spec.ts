import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../../../modules/user';
import { up, down } from '../migrations/3_60c348e546ea00df765dacc6';

describe('replace specialDocumentAnnotator role with publicator role', () => {
  const usersWithNewModel = [
    userModule.generator.generate({ role: 'admin' }),
    userModule.generator.generate({ role: 'annotator' }),
    userModule.generator.generate({ role: 'publicator' }),
  ];
  const usersWithOldModel = [
    usersWithNewModel[0],
    usersWithNewModel[1],
    { ...usersWithNewModel[2], role: 'specialDocumentAnnotator' },
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
