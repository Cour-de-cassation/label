import { annotationType } from '../annotationType';

export { stringify };

function stringify(annotation: annotationType, options?: { displayEntityId?: boolean }) {
  return `(${annotation.category} / ${annotation.text} ${
    options?.displayEntityId ? `(${annotation.entityId}) ` : ''
  }/ ${annotation.start})`;
}
