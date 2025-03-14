import { userGenerator } from './generator';
import { userLib } from './lib';
import { userModel, userType } from './userType';

export { userModule };

export type { userType };

const userModule = {
  models: { user: userModel },
  generator: userGenerator,
  lib: userLib,
};
