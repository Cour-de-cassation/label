import { annotationType, idType } from '@label/core';

export type { customAnnotationRepositoryType };

// eslint-disable-next-line @typescript-eslint/ban-types
type customAnnotationRepositoryType = {
  findAllByDocumentId(documentId: idType): Promise<annotationType[]>;
};
