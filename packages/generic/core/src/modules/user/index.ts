import { userGenerator } from './generator';
import {
  assertPermissions,
  buildUser,
  computeHashedPassword,
  formatEmail,
  generatePassword,
  isPasswordValid,
  isUserPassword,
} from './lib';
import { userModel, userType } from './userType';

export { userModule };

export type { userType };

const userModule = {
  model: userModel,
  generator: userGenerator,
  lib: {
    assertPermissions,
    buildUser,
    computeHashedPassword,
    formatEmail,
    generatePassword,
    isPasswordValid,
    isUserPassword,
  },
};
