import { documentType } from '@label/core';

export type { fetchedDocumentType };

type fetchedDocumentType = Omit<documentType, 'documentId' | 'source' | 'metadata' | 'creationDate'>;
