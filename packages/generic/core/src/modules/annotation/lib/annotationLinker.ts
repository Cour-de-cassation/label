import { annotationType } from '../annotationType';
import { entityIdHandler } from './entityIdHandler';

export { annotationLinker };

const annotationLinker = {
  link,
  unlink,
};

function link<annotationT extends Pick<annotationType, 'entityId'>>(
  annotationSource: annotationT,
  annotationTarget: annotationT,
): annotationT {
  return { ...annotationSource, entityId: annotationTarget.entityId };
}

function unlink<annotationT extends Pick<annotationType, 'category' | 'entityId' | 'text'>>(
  annotation: annotationT,
): annotationT {
  return {
    ...annotation,
    entityId: entityIdHandler.compute(annotation.category, annotation.text),
  };
}
