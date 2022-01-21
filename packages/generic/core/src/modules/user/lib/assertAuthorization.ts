import { errorHandlers } from '../../../errors';
import { userType } from '../userType';

export { assertAuthorization };

function assertAuthorization(user: userType) {
  if (!user.isActivated) {
    throw errorHandlers.authenticationErrorHandler.build(`The user ${user.email} is deactivated`);
  }

  if (!!user.deletionDate) {
    throw errorHandlers.authenticationErrorHandler.build(`The user ${user.email} has been deleted`);
  }
}
