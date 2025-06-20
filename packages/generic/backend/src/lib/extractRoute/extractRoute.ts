import { logger } from '../../utils';
import { documentType } from '@label/core';
import { extractRouteForJurinet } from './extractRouteForJurinet';
import { extractRouteForCivilJurisdiction } from './extractRouteForCivilJurisdiction';
import { Deprecated } from '@label/core';

export { extractRoute };

async function extractRoute(
  document: documentType,
): Promise<documentType['route']> {
  let route: documentType['route'] = 'default';

  const extractRouteFunctions = {
    [Deprecated.Sources.CC]: extractRouteForJurinet,
    [Deprecated.Sources.CA]: extractRouteForCivilJurisdiction,
    [Deprecated.Sources.TJ]: extractRouteForCivilJurisdiction,
    [Deprecated.Sources.TCOM]: extractRouteForCivilJurisdiction,
  };

  try {
    if (document.source in extractRouteFunctions) {
      route = await extractRouteFunctions[
        document.source as Deprecated.Sources
      ](document);
    } else {
      throw new Error('Source non prise en charge');
    }
  } catch (e) {
    logger.error({
      operationName: `extractRouteFor ${document.source}`,
      msg: `Error extracting route for ${document.source}:${document.documentNumber}: ${e}`,
      data: {
        decision: {
          sourceId: document.documentNumber,
          sourceName: document.source,
        },
      },
    });
    route = 'default';
  }

  logger.log({
    operationName: `extractRoute`,
    msg: `Applied route: ${route}`,
    data: {
      appliedRoute: route,
      decision: {
        sourceId: document.documentNumber,
        sourceName: document.source,
      },
    },
  });

  return route;
}
