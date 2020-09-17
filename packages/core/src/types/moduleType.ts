import { generatorType } from "./generatorType";

export { moduleType };

type moduleType<T> = {
  generator: generatorType<T>;
  lib: any;
};
