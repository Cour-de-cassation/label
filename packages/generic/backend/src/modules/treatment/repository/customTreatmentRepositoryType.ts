import { documentType, treatmentType } from '@label/core';

export type { customTreatmentRepositoryType };

type customTreatmentRepositoryType = {
  findAllByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<treatmentType[]>;
  findLastOneByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<treatmentType> | undefined;
  updateOne: (
    documentId: documentType['_id'],
    treatmentFields: Pick<treatmentType, 'annotationsDiff' | 'duration'>,
  ) => Promise<void>;
};
