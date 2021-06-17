import { userGenerator } from './generator';
import {
  assertAuthorization,
  assertPermissions,
  buildUser,
  computeHashedPassword,
  formatEmail,
  passwordHandler,
} from './lib';
import { userModel, userType } from './userType';

export { userModule };

export type { userType };

const userModule = {
  model: userModel,
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
