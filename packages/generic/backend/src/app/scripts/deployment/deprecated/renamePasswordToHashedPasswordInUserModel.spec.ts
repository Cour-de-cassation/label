import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../../../modules/user';
import { renamePasswordToHashedPasswordInUserModel } from './renamePasswordToHashedPasswordInUserModel';

describe('renamePasswordToHashedPasswordInUserModel', () => {
  it('should rename password to hashedPassword in user model in the database', async () => {
    const userRepository = buildUserRepository();
    const users = [
      userModule.generator.generate(),
      userModule.generator.generate(),
      userModule.generator.generate(),
    ];
    const usersWithOldModel = users.map((user) => ({
      email: user.email,
      _id: user._id,
      name: user.name,
      password: user.hashedPassword,
      role: user.role,
    }));
    await Promise.all(
      ((usersWithOldModel as any) as userType[]).map(userRepository.insert),
    );

    await renamePasswordToHashedPasswordInUserModel();

    const usersAfterUpdateModel = await userRepository.findAll();
    expect(usersAfterUpdateModel.sort()).toEqual(users.sort());
  });
});
