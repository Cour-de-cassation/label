import { annotationType, idType } from '@label/core';

export type { customAnnotationRepositoryType };

type customAnnotationRepositoryType = {
  findAllByDocumentId(documentId: idType): Promise<annotationType[]>;
  removeAllByDocumentId(documentId: idType): Promise<void>;
};
