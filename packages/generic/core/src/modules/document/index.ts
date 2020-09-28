import { documentGenerator } from "./generator";
import { documentDataModel, documentType } from "./documentType";

export { documentModule };

export type { documentType };

const documentModule = {
  dataModel: documentDataModel,
  generator: documentGenerator,
  lib: undefined,
};
