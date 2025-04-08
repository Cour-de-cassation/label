import { logger } from '../../utils';
import { documentType } from '@label/core';
import { extractRouteForJurinet } from './extractRouteForJurinet';
import { extractRouteForCivilJurisdiction } from './extractRouteForCivilJurisdiction';
import { Sources } from 'dbsder-api-types';

export { extractRoute };

async function extractRoute(
  document: documentType,
): Promise<documentType['route']> {
  let route: documentType['route'] = 'default';

  const extractRouteFunctions = {
    [Sources.CC]: extractRouteForJurinet,
    [Sources.CA]: extractRouteForCivilJurisdiction,
    [Sources.TJ]: extractRouteForCivilJurisdiction,
    [Sources.TCOM]: extractRouteForCivilJurisdiction,
  };

  try {
    if (document.source in extractRouteFunctions) {
      route = await extractRouteFunctions[document.source as Sources](document);
    } else {
      throw new Error('Source non prise en charge');
    }
  } catch (e) {
    logger.error({
      operationName: `extractRouteFor ${document.source}`,
      msg: `${e}`,
    });
    route = 'default';
  }

  return route;
}
