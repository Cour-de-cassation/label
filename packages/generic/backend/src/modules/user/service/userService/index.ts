import { buildCallAttemptsRegulator } from 'sder-core';
import { changePassword } from './changePassword';
import { createUser } from './createUser';
import { fetchAuthenticatedUserFromAuthorizationHeader } from './fetchAuthenticatedUserFromAuthorizationHeader';
import { fetchUserRole } from './fetchUserRole';
import { fetchUsers } from './fetchUsers';
import { fetchUsersByAssignations } from './fetchUsersByAssignations';
import { fetchUsersByIds } from './fetchUsersByIds';
import { fetchWorkingUsers } from './fetchWorkingUsers';
import { buildLogin } from './login';
import { resetPassword } from './resetPassword';
import { setDeletionDateForUser } from './setDeletionDateForUser';
import { setIsActivatedForUser } from './setIsActivatedForUser';
import { signUpUser } from './signUpUser';

export { userService, buildUserService };

const DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS = 1 * 1000;

const MAX_LOGIN_ATTEMPTS = 1;

const userService = buildUserService();

function buildUserService() {
  const { checkCallAttempts } = buildCallAttemptsRegulator(
    MAX_LOGIN_ATTEMPTS,
    DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS,
  );
  return {
    changePassword,
    createUser,
    fetchAuthenticatedUserFromAuthorizationHeader,
    fetchUsers,
    fetchUsersByIds,
    fetchUsersByAssignations,
    fetchWorkingUsers,
    fetchUserRole,
    login: buildLogin(checkCallAttempts),
    resetPassword,
    setIsActivatedForUser,
    setDeletionDateForUser,
    signUpUser,
  };
}
