import { logger } from '@label/backend';
import { documentType } from '@label/core';
import { extractRouteForJurica } from './extractRouteForJurica';
import { extractRouteForJurinet } from './extractRouteForJurinet';
import { extractRouteForJuritj } from './extractRouteForJuritj';
import { extractRouteForJuritcom } from './extractRouteForJuritcom';

export { extractRoute };

function extractRoute(
  routeInfos: {
    additionalTermsToAnnotate: documentType['decisionMetadata']['additionalTermsToAnnotate'];
    session: documentType['decisionMetadata']['session'];
    solution: documentType['decisionMetadata']['solution'];
    parties: documentType['decisionMetadata']['parties'];
    publicationCategory: documentType['publicationCategory'];
    chamberName: documentType['decisionMetadata']['chamberName'];
    civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
    civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
    criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
    NACCode: documentType['decisionMetadata']['NACCode'];
    endCaseCode: documentType['decisionMetadata']['endCaseCode'];
    status?: documentType['status'];
  },
  source: documentType['source'],
): documentType['route'] {
  let route: documentType['route'] = 'default';

  // TODO : use dbsder-api-types
  enum Sources {
    CC = 'jurinet',
    CA = 'jurica',
    TJ = 'juritj',
    TCOM = 'juritcom',
  }

  const extractRouteFunctions = {
    [Sources.CC]: extractRouteForJurinet,
    [Sources.CA]: extractRouteForJurica,
    [Sources.TJ]: extractRouteForJuritj,
    [Sources.TCOM]: extractRouteForJuritcom,
  };

  try {
    if (source in extractRouteFunctions) {
      route = extractRouteFunctions[source as Sources]({
        ...routeInfos,
      });
    } else {
      throw new Error('Source non prise en charge');
    }
  } catch (e) {
    logger.error({ operationName: `extractRouteFor ${source}`, msg: `${e}` });
    route = 'exhaustive';
  }

  if (
    (!!routeInfos.additionalTermsToAnnotate ||
      (routeInfos.parties && routeInfos.parties.length > 50)) &&
    (route == 'simple' || route == 'default')
  ) {
    route = 'exhaustive';
  }

  return route;
}
