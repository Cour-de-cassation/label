import { mongoIdType } from "../../utils";
import { entityType } from "../entity";

export { annotationType };

type annotationType = {
  entity: entityType;
  courtDecisionId: mongoIdType;
  source: string;
  start: number;
  text: string;
};
