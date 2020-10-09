import { annotationType } from "../annotationType";

export { computeAnnotationEntityId };

function computeAnnotationEntityId(
  annotationFields: Pick<annotationType, "category" | "text">
) {
  return `${annotationFields.category}_${annotationFields.text}`;
}
