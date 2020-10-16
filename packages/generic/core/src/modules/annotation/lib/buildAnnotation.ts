import { idModule, omitIdType } from "../../id";
import { annotationType } from "../annotationType";
import { computeAnnotationEntityId } from "./computeAnnotationEntityId";

export { buildAnnotation };

function buildAnnotation(
  annotationFields: Omit<omitIdType<annotationType>, "entityId">
): annotationType {
  return {
    ...annotationFields,
    entityId: computeAnnotationEntityId(annotationFields),
    _id: idModule.lib.buildId(),
  };
}
