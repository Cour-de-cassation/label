import { documentType } from '@label/core';
import { sderApi } from '../../../../sderApi';
import { logger } from '@label/backend';

export { extractRouteForJuritj };

async function extractRouteForJuritj({
  NACCode,
  endCaseCode,
}: {
  NACCode: documentType['decisionMetadata']['NACCode'];
  endCaseCode: documentType['decisionMetadata']['endCaseCode'];
}): Promise<documentType['route']> {
  try {
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
  } catch (e) {
    logger.error({ operationName: 'extractRouteForJuritj', msg: `${e}` });
    return 'default';
  }
}
