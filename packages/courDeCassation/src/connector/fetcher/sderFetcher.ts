import { sderApi } from '../../sderApi';

export { sderFetcher };

const sderFetcher = {
  fetchCourtDecisionBySourceIdAndSourceName:
    sderApi.fetchCourtDecisionBySourceIdAndSourceName,
  fetchDecisionsToPseudonymise: sderApi.fetchDecisionsToPseudonymise,
};
