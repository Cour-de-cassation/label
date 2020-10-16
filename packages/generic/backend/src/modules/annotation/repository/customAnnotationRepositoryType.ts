import { annotationType, mongoIdType } from '@label/core';

export type { customAnnotationRepositoryType };

// eslint-disable-next-line @typescript-eslint/ban-types
type customAnnotationRepositoryType = {
  findAllByDocumentId(documentId: mongoIdType): Promise<annotationType[]>;
};
