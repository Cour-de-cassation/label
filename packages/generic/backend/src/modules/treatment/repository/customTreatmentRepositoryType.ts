import { treatmentType } from '@label/core';

export type { customTreatmentRepositoryType };

type customTreatmentRepositoryType = {
  countByDocumentId: (
    documentId: treatmentType['documentId'],
  ) => Promise<number>;
  deleteByDocumentId: (
    documentId: treatmentType['documentId'],
  ) => Promise<void>;
  findAllByDocumentId: (
    documentId: treatmentType['documentId'],
  ) => Promise<treatmentType[]>;
  findAllByDocumentIds: (
    documentIds: treatmentType['documentId'][],
  ) => Promise<Record<string, treatmentType[]>>;
  findExtremumLastUpdateDateBySources: (
    sources: treatmentType['source'][],
  ) => Promise<{ minDate: number | undefined; maxDate: number | undefined }>;
};
