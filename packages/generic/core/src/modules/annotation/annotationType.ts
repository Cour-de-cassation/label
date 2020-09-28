import { mongoIdType } from "../../utils";
import { annotationEntityType } from "../annotationEntity";

export { annotationType };

type annotationType = {
  annotationEntity: annotationEntityType;
  documentId: mongoIdType;
  source: string;
  _id: mongoIdType;
  start: number;
  text: string;
};
