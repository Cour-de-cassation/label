import { userGenerator } from "./generator";
import { userLib } from "./lib";
import { userType } from "./userType";

export { userModule, userType };

const userModule = {
  generator: userGenerator,
  lib: userLib,
};
