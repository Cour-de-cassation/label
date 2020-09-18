import { annotationType } from '@label/core';

export { annotationRepositoryType };

type annotationRepositoryType = {
  insert: (annotation: annotationType) => Promise<{ success: boolean }>;
};
