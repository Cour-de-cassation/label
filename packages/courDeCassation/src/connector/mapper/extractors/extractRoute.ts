import { decisionType } from 'sder';
import { documentType } from '@label/core';

export { extractRoute };

function extractRoute(decision: decisionType): documentType['route'] {
  if (decision.solution === 'Non-admission') {
    return 'automatic';
  }
  return 'exhaustive';
}
