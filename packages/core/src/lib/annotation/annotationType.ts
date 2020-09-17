import { mongoIdType } from "../../utils";
import { nlpEntityType } from "../nlpEntity";

export { annotationType };

type annotationType = {
  nlpEntity: nlpEntityType;
  courtDecisionId: mongoIdType;
  source: string;
  start: number;
  text: string;
};
