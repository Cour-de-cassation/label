import { userGenerator } from './generator';
import { userLib } from './lib';
import { userType } from './userType';

export { userModule };

export type { userType };

const userModule = {
  generator: userGenerator,
  lib: userLib,
};
