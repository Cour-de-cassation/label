import { documentType, treatmentType } from '@label/core';

export type { customTreatmentRepositoryType };

type customTreatmentRepositoryType = {
  findLastOneByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<treatmentType> | undefined;
};
