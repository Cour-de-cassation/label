import { userGenerator } from './generator';
import {
  assertAuthorization,
  assertPermissions,
  buildUser,
  computeHashedPassword,
  formatEmail,
  passwordHandler,
} from './lib';
import { userModel, userType, passwordTimeValidityStatusType, passwordTimeValidityStatusModel } from './userType';

export { userModule };

export type { userType, passwordTimeValidityStatusType };

const userModule = {
  models: { user: userModel, passwordTimeValidityStatus: passwordTimeValidityStatusModel },
  generator: userGenerator,
  lib: {
    assertAuthorization,
    assertPermissions,
    buildUser,
    computeHashedPassword,
    formatEmail,
    passwordHandler,
  },
};
