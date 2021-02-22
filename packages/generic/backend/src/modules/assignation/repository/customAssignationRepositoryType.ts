import { assignationType, documentType, userType } from '@label/core';

export type { customAssignationRepositoryType };

type customAssignationRepositoryType = {
  findAllByUserId: (userId: userType['_id']) => Promise<assignationType[]>;
  findAllByDocumentId: (
    documentId: documentType['_id'],
  ) => Promise<assignationType[]>;
  findByDocumentIdAndUserId: ({
    documentId,
    userId,
  }: {
    documentId: documentType['_id'];
    userId: userType['_id'];
  }) => Promise<assignationType | undefined>;
};
