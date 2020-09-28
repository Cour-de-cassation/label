import { mongoIdType } from "../../utils";
import { nlpEntityType } from "../nlpEntity";

export { annotationType };

type annotationType = {
  nlpEntity: nlpEntityType;
  courtDecisionId: mongoIdType;
  source: string;
  _id: mongoIdType;
  start: number;
  text: string;
};
