import { documentType } from '@label/core';
import { sderApi } from '../../../../sderApi';

export { extractRouteForJuritj };

async function extractRouteForJuritj({
  NACCode,
  endCaseCode,
}: {
  NACCode: documentType['decisionMetadata']['NACCode'];
  endCaseCode: documentType['decisionMetadata']['endCaseCode'];
}): Promise<documentType['route']> {
  const routeFromMetadata = await sderApi.getDecisionRoute({
    codeNac: NACCode,
    codeDecision: endCaseCode,
    source: 'juritj',
  });
  if (routeFromMetadata) {
    return routeFromMetadata as documentType['route'];
  } else {
    return 'default';
  }
}
