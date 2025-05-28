import { documentType } from '@label/core';
import { Deprecated } from '@label/core';
import axios, { AxiosResponse, Method } from 'axios';
import { documentService } from '../../modules/document';
import { logger } from '../../utils';

export { extractRouteForCivilJurisdiction };

async function extractRouteForCivilJurisdiction(
  document: documentType,
): Promise<documentType['route']> {
  const selection = document.decisionMetadata.selection;
  const sommaire = document.decisionMetadata.sommaire;
  const NACCode = document.decisionMetadata.NACCode;
  const source = document.source;
  const additionalTermsToAnnotate =
    document.decisionMetadata.additionalTermsToAnnotate;
  const checklist = document.checklist;

  // En attente de stabilisation du flux avant d'implémenter les règles spécifiques
  if (source === Deprecated.Sources.TCOM) {
    return 'default';
  }

  if (checklist.length > 0) {
    return 'exhaustive';
  }

  // Relecture exhaustive pour les décisions présentant un intéret particulier
  if (selection === true /* && sommaire != '' */) {
    return 'exhaustive';
  }

  // Relecture exhaustive pour les décisions comportant des demandes d'occultation particulières
  if (additionalTermsToAnnotate != '') {
    return 'exhaustive';
  }

  if (source === Deprecated.Sources.CA || source === Deprecated.Sources.TJ) {
    const routeFromDb = await getDecisionRoute(NACCode);

    const freeDocuments = await documentService.countFreeDocuments();
    const targetFreeDocuments = 15000;
    const nonSensibleMinimumRatio = 0.01;
    const sensibleMinimumRatio = 0.1;

    const ratio = Math.max(
      0,
      (targetFreeDocuments - freeDocuments) / targetFreeDocuments,
    );

    // nonSensibleRatio est toujours supérieur a sa limite minimum
    const nonSensibleRatio =
      ratio < nonSensibleMinimumRatio ? nonSensibleMinimumRatio : ratio;

    // sensibleRatio est 10 fois plus élevé que nonSensibleRatio, toujours supérieur a sa limite minimale, dans la limite logique de 100%
    const sensibleRatio = Math.min(
      1,
      nonSensibleRatio * 10 < sensibleMinimumRatio
        ? sensibleMinimumRatio
        : nonSensibleRatio * 10,
    );

    switch (routeFromDb) {
      case 'systematique': {
        logger.log({
          operationName: 'computeRouteFromNac',
          msg: 'Route systematique',
          data: { routeFromDb, routeRelecture: 'exhaustive' },
        });
        return 'exhaustive';
      }
      case 'aleatoireSensible': {
        const routeRelecture =
          Math.random() < sensibleRatio ? 'exhaustive' : 'automatic';
        logger.log({
          operationName: 'computeRouteFromNac',
          msg: 'Route systematique',
          data: { routeFromDb, routeRelecture },
        });
        return routeRelecture;
      }
      case 'aleatoireNonSensible': {
        const routeRelecture =
          Math.random() < nonSensibleRatio ? 'exhaustive' : 'automatic';
        logger.log({
          operationName: 'computeRouteFromNac',
          msg: 'Route systematique',
          data: { routeFromDb, routeRelecture },
        });
        return routeRelecture;
      }
      default:
        throw new Error('Route non trouvée en base');
    }
  }

  return 'default';
}

async function fetchApi<T>({
  method,
  path,
  body,
}: {
  method: Method;
  path: string;
  body?: Record<string, unknown>;
}): Promise<T> {
  try {
    const response: AxiosResponse = await axios({
      method,
      baseURL: `${process.env.DBSDER_API_URL}`,
      url: `/${path}`,
      data: body,
      headers: {
        'x-api-key': process.env.DBSDER_API_KEY ?? '',
      },
    });

    if (![200, 204].includes(response.status)) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.data as T;
  } catch (error: unknown) {
    throw error;
  }
}

async function getDecisionRoute(code: string): Promise<string | undefined> {
  try {
    const codenac = await fetchApi<Deprecated.CodeNAC>({
      method: 'get',
      path: `codenacs/${code}`,
    });

    return codenac.routeRelecture;
  } catch (error) {
    logger.error({
      operationName: 'getDecisionRoute',
      msg: `Failed to fetch code nac for code "${code}"`,
    });
    return undefined;
  }
}
