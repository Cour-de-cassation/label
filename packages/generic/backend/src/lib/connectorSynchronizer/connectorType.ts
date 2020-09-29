import { documentType } from '@label/core';

export type { connectorType };

type connectorType = {
  name: string;
  fetchAllDocuments(): Promise<documentType[]>;
};
