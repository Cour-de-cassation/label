import { generatorType } from "../../../types";
import { annotationEntityLib } from "../lib";
import { annotationEntityType } from "../annotationEntityType";

export { annotationEntityGenerator };

const annotationEntityGenerator: generatorType<annotationEntityType> = {
  generate: (label) =>
    label ? label : annotationEntityLib.buildAnnotationEntity("LABEL"),
};
