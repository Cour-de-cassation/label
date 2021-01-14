import { annotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationLinker };

const annotationLinker = {
  link,
  unlink,
};

function link(annotationSource: annotationType, annotationTarget: annotationType): annotationType {
  return { ...annotationSource, entityId: annotationTarget.entityId };
}

function unlink(annotation: annotationType): annotationType {
  return {
    ...annotation,
    entityId: entityIdHandler.compute(annotation.category, annotation.text),
  };
}
