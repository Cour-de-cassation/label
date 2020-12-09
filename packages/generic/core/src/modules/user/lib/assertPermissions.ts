import { errorHandlers } from '../../../errors';
import { userType } from '../userType';

export { assertPermissions };

function assertPermissions(user: userType, permissions: Array<userType['role']>) {
  if (!permissions.includes(user.role)) {
    throw errorHandlers.permissionErrorHandler.build(`user ${user._id} has not the right permissions ${permissions}`);
  }
}
