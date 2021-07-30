import { buildUserRepository } from '../../repository';

export { fetchUsers };

async function fetchUsers() {
  const userRepository = buildUserRepository();
  return userRepository.findAllByIds();
}
