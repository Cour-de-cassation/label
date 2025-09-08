import { userType } from '../userType';

export { assertPermissions };

function assertPermissions(user: userType, permissions: Array<userType['role']>) {
  if (!permissions.includes(user.role)) {
    throw new Error(`user ${user._id} has not the right permissions ${permissions}`);
  }
}
