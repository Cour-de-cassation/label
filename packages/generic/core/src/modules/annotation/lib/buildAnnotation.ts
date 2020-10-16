import { buildMongoId } from "../../../lib";
import { omitMongoIdType } from "../../../types";
import { annotationType } from "../annotationType";
import { computeAnnotationEntityId } from "./computeAnnotationEntityId";

export { buildAnnotation };

function buildAnnotation(
  annotationFields: Omit<omitMongoIdType<annotationType>, "entityId">
): annotationType {
  return {
    ...annotationFields,
    entityId: computeAnnotationEntityId(annotationFields),
    _id: buildMongoId(),
  };
}
