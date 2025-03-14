import { buildUserRepository } from '../../repository';

export { fetchWorkingUsers };

async function fetchWorkingUsers() {
  const userRepository = buildUserRepository();
  const users = await userRepository.findAll(); // This returns an array of users

  if (!users || users.length === 0) {
    throw new Error('No users found');
  }

  return users.map((user) => {
    const { _id, email, name, role } = user;
    return {
      _id,
      email,
      name,
      role,
    };
  });
}
