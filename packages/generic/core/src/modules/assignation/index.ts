import { assignationType, assignationStatusType } from "./assignationType";
import { assignationGenerator } from "./generator";
import { buildAssignation } from "./lib";

export { assignationModule };

export type { assignationType, assignationStatusType };

const assignationModule = {
  generator: assignationGenerator,
  lib: { buildAssignation },
};
