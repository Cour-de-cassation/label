import { buildUserRepository } from '../../repository';

export { fetchWorkingUsers };

async function fetchWorkingUsers() {
  const userRepository = buildUserRepository();
  const users = await userRepository.findAllWithNoDeletionDateProjection([
    '_id',
    'email',
    'isActivated',
    'name',
    'role',
  ]);
  return users.map(({ _id, email, isActivated, name, role }) => ({
    _id,
    email,
    isActivated,
    name,
    role,
  }));
}
