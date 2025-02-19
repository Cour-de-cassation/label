import { createUser } from './createUser';
import { fetchUserRole } from './fetchUserRole';
import { fetchUsers } from './fetchUsers';
import { fetchUsersByAssignations } from './fetchUsersByAssignations';
import { fetchUsersByIds } from './fetchUsersByIds';
import { fetchWorkingUsers } from './fetchWorkingUsers';
import { signUpUser } from './signUpUser';
import { updateUser } from './updateUser';

export { userService, buildUserService };

const userService = buildUserService();

function buildUserService() {
  return {
    createUser,
    fetchUsers,
    fetchUsersByIds,
    fetchUsersByAssignations,
    fetchWorkingUsers,
    fetchUserRole,
    signUpUser,
    updateUser,
  };
}
