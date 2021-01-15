import { documentType, treatmentType } from '@label/core';

export type { customTreatmentRepositoryType };

type customTreatmentRepositoryType = {
  findAllByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<treatmentType[]>;
  findLastOneByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<treatmentType> | undefined;
};
