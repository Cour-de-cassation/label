import { documentType } from '@label/core';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchAllDocumentsSince(days: number): Promise<documentType[]>;
  updateDocumentsLoadedStatus: (documents: documentType[]) => Promise<void>;
};
