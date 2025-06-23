import { sderApi } from '../../sderApi';
import { Deprecated } from '@label/core';

export { sderFetcher };

const sderFetcher = {
  fetchCourtDecisionBySourceIdAndSourceName: sderApi.fetchCourtDecisionBySourceIdAndSourceName,
  fetchDecisionsToPseudonymise: sderApi.fetchDecisionsToPseudonymise
};
