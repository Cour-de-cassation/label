import { logger } from '@label/backend';
import { documentType } from '@label/core';
import { extractRouteForJurica } from './extractRouteForJurica';
import { extractRouteForJurinet } from './extractRouteForJurinet';
import { extractRouteForJuritj } from './extractRouteForJuritj';
import { extractRouteForJuritcom } from './extractRouteForJuritcom';
import { Sources } from 'dbsder-api-types';

export { extractRoute };

async function extractRoute(
  routeInfos: {
    additionalTermsToAnnotate: documentType['decisionMetadata']['additionalTermsToAnnotate'];
    session: documentType['decisionMetadata']['session'];
    solution: documentType['decisionMetadata']['solution'];
    parties: documentType['decisionMetadata']['parties'];
    publicationCategory: documentType['publicationCategory'];
    chamberName: documentType['decisionMetadata']['chamberName'];
    NACCode: documentType['decisionMetadata']['NACCode'];
    endCaseCode: documentType['decisionMetadata']['endCaseCode'];
  },
  source: documentType['source'],
): Promise<documentType['route']> {
  let route: documentType['route'] = 'default';

  const extractRouteFunctions = {
    [Sources.CC]: extractRouteForJurinet,
    [Sources.CA]: extractRouteForJurica,
    [Sources.TJ]: extractRouteForJuritj,
    [Sources.TCOM]: extractRouteForJuritcom,
  };

  try {
    if (source in extractRouteFunctions) {
      route = await extractRouteFunctions[source as Sources]({
        ...routeInfos,
      });
    } else {
      throw new Error('Source non prise en charge');
    }
  } catch (e) {
    logger.error({ operationName: `extractRouteFor ${source}`, msg: `${e}` });
    route = 'default';
  }

  if (
    !!routeInfos.additionalTermsToAnnotate &&
    (route === 'automatic' || route === 'simple' || route === 'default')
  ) {
    route = 'exhaustive';
  }

  if (
    routeInfos.parties &&
    routeInfos.parties.length > 50 &&
    (route == 'simple' || route == 'default')
  ) {
    route = 'exhaustive';
  }

  return route;
}
