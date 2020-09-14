import { entityType } from "../entity";

export { annotationType };

type annotationType = {
  entity: entityType;
  source: string;
  start: number;
  text: string;
};
