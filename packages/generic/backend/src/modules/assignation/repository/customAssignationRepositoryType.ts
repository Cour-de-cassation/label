import { assignationType, documentType, idType, userType } from '@label/core';

export type { customAssignationRepositoryType };

type customAssignationRepositoryType = {
  findAllByUserId: (userId: idType) => Promise<assignationType[]>;
  findByDocumentIdAndUserId: ({
    documentId,
    userId,
  }: {
    documentId: documentType['_id'];
    userId: userType['_id'];
  }) => Promise<assignationType | undefined>;
};
