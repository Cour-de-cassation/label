import { documentGenerator } from "./generator";
import { documentDataModel, documentType } from "./documentType";

export { documentModule, documentType };

const documentModule = {
  dataModel: documentDataModel,
  generator: documentGenerator,
  lib: undefined,
};
