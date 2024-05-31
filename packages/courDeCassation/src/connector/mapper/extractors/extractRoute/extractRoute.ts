import { logger } from '@label/backend';
import { documentType } from '@label/core';
import { extractRouteForJurica } from './extractRouteForJurica';
import { extractRouteForJurinet } from './extractRouteForJurinet';
import { extractRouteForJuritj } from './extractRouteForJuritj';

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

  switch (source) {
    case 'jurinet':
      try {
        route = extractRouteForJurinet({ ...routeInfos });
      } catch (e) {
        logger.error({ operationName: 'extractRouteForJurinet', msg: `${e}` });
        route = 'exhaustive';
      }
      break;
    case 'jurica':
      try {
        route = extractRouteForJurica({ ...routeInfos });
      } catch (e) {
        logger.error({ operationName: 'extractRouteForJurica', msg: `${e}` });
        route = 'exhaustive';
      }
      break;
    case 'juritj':
      try {
        route = extractRouteForJuritj({ ...routeInfos });
      } catch (e) {
        logger.error({ operationName: 'extractRouteForJuritj', msg: `${e}` });
        route = 'exhaustive';
      }
      break;
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
