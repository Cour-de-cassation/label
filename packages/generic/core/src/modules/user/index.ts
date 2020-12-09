import { userGenerator } from './generator';
import { assertPermissions, buildUser } from './lib';
import { userDataModel, userType } from './userType';

export { userModule };

export type { userType };

const userModule = {
  dataModel: userDataModel,
  generator: userGenerator,
  lib: { assertPermissions, buildUser },
};
