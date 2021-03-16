import { documentType, idType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  assign: (priority: documentType['priority']) => Promise<documentType>;
  findAllByStatus: (
    status: documentType['status'][],
  ) => Promise<documentType[]>;
  updateStatusById: (
    id: idType,
    status: documentType['status'],
  ) => Promise<void>;
};
