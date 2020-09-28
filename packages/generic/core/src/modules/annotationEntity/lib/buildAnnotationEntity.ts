import { random } from "lodash";
import { annotationEntityType } from "../annotationEntityType";

export { buildAnnotationEntity };

function buildAnnotationEntity(label: string): annotationEntityType {
  return `${label}_${random(10 ** 10)}`;
}
