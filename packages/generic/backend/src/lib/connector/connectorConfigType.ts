import { documentType } from '@label/core';
import { Deprecated } from '@label/core';

export type { connectorConfigType };

type connectorConfigType = {
  name: string;
  fetchCourtDecisionBySourceIdAndSourceName(
    sourceId: number,
    sourceName: string,
  ): Promise<Deprecated.DecisionDTO | undefined>;
  fetchDecisionsToPseudonymise(
    sourceName: string,
  ): Promise<Deprecated.DecisionDTO[]>;
  updateDocumentLabelStatusToLoaded: (externalId: string) => Promise<void>;
  mapCourtDecisionToDocument: (
    courtDecision: Deprecated.DecisionDTO,
    importer: documentType['importer'],
  ) => Promise<documentType>;
};
