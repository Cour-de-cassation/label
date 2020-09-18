import { annotationType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../tests';
import { annotationRepositoryType } from './annotationRepositoryType';

export { buildFakeAnnotationRepository };

const buildFakeAnnotationRepository = buildFakeRepositoryBuilder<
  annotationType,
  annotationRepositoryType
>(collection => {
  return {
    insert,
  };

  async function insert(annotation: annotationType) {
    collection.push(annotation);
    return { success: true };
  }
});
