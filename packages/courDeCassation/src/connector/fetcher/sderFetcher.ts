import { sderApi } from '../../sderApi';
import { Deprecated } from '@label/core';

export { sderFetcher };

const sderFetcher = {
  async fetchCourtDecisionBySourceIdAndSourceName(
    sourceId: number,
    sourceName: Deprecated.Sources,
  ) {
    return sderApi.fetchCourtDecisionBySourceIdAndSourceName(
      sourceId,
      sourceName,
    );
  },

  async fetchDecisionsToPseudonymise(sourceName: string) {
    const courtDecisions = await sderApi.fetchDecisionsToPseudonymise(
      sourceName,
    );

    return courtDecisions?.filter((courtDecision) => {
      if (!courtDecision.originalText) {
        return false;
      }
      return true;
    });
  },
};
