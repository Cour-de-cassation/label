import { buildUserRepository } from '../../repository';

export { fetchWorkingUsers };

async function fetchWorkingUsers() {
  const userRepository = buildUserRepository();
  const users = await userRepository.findAllWithNoDeletionDate();
  return users.map(({ _id, email, isActivated, name, role }) => ({
    _id,
    email,
    isActivated,
    name,
    role,
  }));
}
