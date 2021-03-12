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
import { userDataModel, userType } from './userType';

export { userModule };

export type { userType };

const userModule = {
  dataModel: userDataModel,
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
