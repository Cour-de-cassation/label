import {
  assignationType,
  documentType,
  treatmentType,
  userType,
} from '@label/core';

export type { customAssignationRepositoryType };

type customAssignationRepositoryType = {
  findAllByUserId: (userId: userType['_id']) => Promise<assignationType[]>;
  findAllByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<assignationType[]>;
  findAllByDocumentIds: (
    documentIdsToSearchIn: documentType['_id'][],
  ) => Promise<Record<string, assignationType[]>>;
  findByDocumentIdAndUserId: ({
    documentId,
    userId,
  }: {
    documentId: documentType['_id'];
    userId: userType['_id'];
  }) => Promise<assignationType | undefined>;
  findByTreatmentId: (
    treatmentId: treatmentType['_id'],
  ) => Promise<assignationType | undefined>;
};
