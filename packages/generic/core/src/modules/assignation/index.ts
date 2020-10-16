import { assignationType } from "./assignationType";
import { assignationGenerator } from "./generator";
import { buildAssignation } from "./lib";

export { assignationModule };

export type { assignationType };

const assignationModule = {
  generator: assignationGenerator,
  lib: { buildAssignation },
};
