import { documentType } from '@label/core';
import { DecisionDTO } from 'dbsder-api-types';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchCourtDecisionBySourceIdAndSourceName(
    sourceId: number,
    sourceName: string,
  ): Promise<DecisionDTO | undefined>;
  fetchDecisionsToPseudonymise(sourceName: string): Promise<DecisionDTO[]>;
  updateDocumentLabelStatusToLoaded: (externalId: string) => Promise<void>;
  mapCourtDecisionToDocument: (
    courtDecision: DecisionDTO,
    importer: documentType['importer'],
  ) => Promise<documentType>;
};
