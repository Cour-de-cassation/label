import { annotationType } from '@label/core';

export type { fetchedAnnotationType };

type fetchedAnnotationType = Omit<annotationType, 'documentId' | 'source'>;
