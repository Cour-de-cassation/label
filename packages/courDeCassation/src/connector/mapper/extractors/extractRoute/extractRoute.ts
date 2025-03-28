import { logger } from '@label/backend';
import { documentType } from '@label/core';
import { extractRouteForJurinet } from './extractRouteForJurinet';
import { extractRouteForCivilJurisdiction } from './extractRouteForCivilJurisdiction';
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
    [Sources.CA]: extractRouteForCivilJurisdiction,
    [Sources.TJ]: extractRouteForCivilJurisdiction,
    [Sources.TCOM]: extractRouteForCivilJurisdiction,
  };

  try {
    if (source in extractRouteFunctions) {
      route = await extractRouteFunctions[source as Sources]({
        ...routeInfos,
        source,
      });
    } else {
      throw new Error('Source non prise en charge');
    }
  } catch (e) {
    logger.error({ operationName: `extractRouteFor ${source}`, msg: `${e}` });
    route = 'default';
  }

  return route;
}
