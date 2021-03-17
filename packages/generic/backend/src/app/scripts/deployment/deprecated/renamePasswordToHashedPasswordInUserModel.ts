import { buildUserRepository } from '../../../../modules/user';

export { renamePasswordToHashedPasswordInUserModel };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
async function renamePasswordToHashedPasswordInUserModel() {
  const userRepository = buildUserRepository();

  const users = await userRepository.findAll();

  const usersWithNewDataModel = users.map((user) => ({
    email: user.email,
    hashedPassword: (user as any).password,
    _id: user._id,
    name: user.name,
    role: user.role,
  }));

  await userRepository.clear();

  await Promise.all(usersWithNewDataModel.map(userRepository.insert));
}
