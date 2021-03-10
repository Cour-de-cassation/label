import { userModule, userType } from '@label/core';
import { buildUserRepository } from '../../../modules/user';
import { updateUserModel } from './updateUserModel';

describe('freePendingDocuments', () => {
  it('should update the user model in the database', async () => {
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

    await updateUserModel();

    const usersAfterUpdateModel = await userRepository.findAll();
    expect(usersAfterUpdateModel.sort()).toEqual(users.sort());
  });
});
