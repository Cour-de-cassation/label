import { documentGenerator } from "./generator";
import { documentDataModel, documentType } from "./documentType";
import { buildDocument } from "./lib";

export { documentModule };

export type { documentType };

const documentModule = {
  dataModel: documentDataModel,
  generator: documentGenerator,
  lib: { buildDocument },
};
