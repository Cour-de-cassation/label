import { documentType, treatmentType } from '@label/core';

export type { customTreatmentRepositoryType };

type customTreatmentRepositoryType = {
  deleteByDocumentId: (
    documentId: treatmentType['documentId'],
  ) => Promise<void>;
  findAllByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<treatmentType[]>;
  findAllByDocumentIds: (
    documentIds: documentType['_id'][],
  ) => Promise<Record<string, treatmentType[]>>;
  findLastOneByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<treatmentType> | undefined;
};
