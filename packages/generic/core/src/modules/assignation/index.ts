import { assignationType, assignationDataModel } from "./assignationType";
import { assignationGenerator } from "./generator";
import { buildAssignation } from "./lib";

export { assignationModule };

export type { assignationType };

const assignationModule = {
  dataModel: assignationDataModel,
  generator: assignationGenerator,
  lib: { buildAssignation },
};
