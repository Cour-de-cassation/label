import { buildCallAttemptsRegulator } from 'sder-core';
import { createUser } from './createUser';
import { fetchAuthenticatedUserFromAuthorizationHeader } from './fetchAuthenticatedUserFromAuthorizationHeader';
import { fetchUserRole } from './fetchUserRole';
import { fetchUsers } from './fetchUsers';
import { fetchUsersByAssignations } from './fetchUsersByAssignations';
import { fetchUsersByIds } from './fetchUsersByIds';
import { fetchWorkingUsers } from './fetchWorkingUsers';
import { signUpUser } from './signUpUser';
import {
  acsSso,
  getMetadataSso,
  loginSso,
  logoutSso,
} from './ssoCnx';

export { userService, buildUserService };

const DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS = 1 * 1000;

const MAX_LOGIN_ATTEMPTS = 1;

const userService = buildUserService();

function buildUserService() {
  buildCallAttemptsRegulator(
    MAX_LOGIN_ATTEMPTS,
    DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS
  );
  return {
    createUser,
    fetchAuthenticatedUserFromAuthorizationHeader,
    fetchUsers,
    fetchUsersByIds,
    fetchUsersByAssignations,
    fetchWorkingUsers,
    fetchUserRole,
    signUpUser,
    acsSso,
    getMetadataSso,
    loginSso,
    logoutSso,
  };
}
