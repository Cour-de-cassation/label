import { documentType, idType } from '@label/core';

export type { customDocumentRepositoryType };

type customDocumentRepositoryType = {
  lock: (param?: { idsToExclude?: idType[] }) => Promise<documentType>;
};
