import { logger } from '@label/backend';
import { documentType } from '@label/core';
import { extractRouteForJurica } from './extractRouteForJurica';
import { extractRouteForJurinet } from './extractRouteForJurinet';

export { extractRoute };

function extractRoute(
  routeInfos: {
    additionalTermsToAnnotate: documentType['decisionMetadata']['additionalTermsToAnnotate'];
    session: documentType['decisionMetadata']['session'];
    solution: documentType['decisionMetadata']['solution'];
    publicationCategory: documentType['publicationCategory'];
    chamberId: string;
    civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
    civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
    criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
    NACCode: documentType['decisionMetadata']['NACCode'];
    endCaseCode: documentType['decisionMetadata']['endCaseCode'];
  },
  source: documentType['source'],
): documentType['route'] {
  let route: documentType['route'] = 'default';

  switch (source) {
    case 'jurinet':
      try {
        route = extractRouteForJurinet({ ...routeInfos });
      } catch (e) {
        logger.log(e);
        route = 'exhaustive';
      }
      break;
    case 'jurica':
      try {
        route = extractRouteForJurica({ ...routeInfos });
      } catch (e) {
        logger.log(e);
        route = 'exhaustive';
      }
      break;
  }

  if (
    route == 'default' ||
    (!!routeInfos.additionalTermsToAnnotate && route == 'simple')
  ) {
    route = 'exhaustive';
  }

  return route;
}
