import { documentType } from '@label/core';
import { Sources } from 'dbsder-api-types';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { documentService } from '../../modules/document';

export { extractRouteForCivilJurisdiction };

async function extractRouteForCivilJurisdiction(
  document: documentType,
): Promise<documentType['route']> {
  // const selection = document.decisionMetadata.selection;
  // const sommaire = document.decisionMetadata.sommaire;
  const NACCode = document.decisionMetadata.NACCode;
  const source = document.source;
  const additionalTermsToAnnotate =
    document.decisionMetadata.additionalTermsToAnnotate;
  const checklist = document.checklist;

  // En attente de stabilisation du flux avant d'implémenter les règles spécifiques
  if (source === Sources.TCOM) {
    return 'default';
  }

  if (checklist.length > 0) {
    return 'exhaustive';
  }

  // Relecture exhaustive pour les décisions présentant un intéret particulier
  // En attente de validation métier pour être implémenté
  // if (selection === 'true') {
  //   return 'exhaustive';
  // }

  // Relecture exhaustive pour les décisions comportant des demandes d'occultation particulières
  if (additionalTermsToAnnotate != '') {
    return 'exhaustive';
  }

  if (source === Sources.CA || source === Sources.TJ) {
    const routeFromDb = await getDecisionRoute({
      codeNac: NACCode,
    });

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
      case 'systematique':
        return 'exhaustive';
      case 'aleatoireSensible':
        return Math.random() < sensibleRatio ? 'exhaustive' : 'automatic';
      case 'aleatoireNonSensible':
        return Math.random() < nonSensibleRatio ? 'exhaustive' : 'automatic';
      default:
        throw new Error('Route non trouvée en base');
    }
  }

  return 'default';
}

// Same as sderApi.ts, duplicated waiting for extractRoute to be moved from label
async function fetchApi({
  method,
  path,
  body,
}: {
  method: Method;
  path: string;
  body: Record<string, unknown>;
}) {
  return await axios({
    method: method,
    baseURL: `${process.env.DBSDER_API_URL}/${process.env.DBSDER_API_VERSION}`,
    url: `/${path}`,
    data: body,
    headers: {
      'x-api-key': process.env.DBSDER_API_KEY ?? '',
    },
  })
    .then((response: AxiosResponse) => {
      if (response.status != 200 && response.status != 204) {
        throw new Error(`${response.status} ${response.statusText}`);
      } else {
        return response.data as Record<string, unknown>;
      }
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        throw new Error(
          `${error.response.status} ${error.response.statusText}`,
        );
      }
      throw new Error(`${error.code ?? 'Unknown'} on /${path}`);
    });
}

async function getDecisionRoute({ codeNac }: { codeNac: string }) {
  return ((await fetchApi({
    method: 'get',
    path: `decision-route?codeNac=${codeNac}`,
    body: {},
  })) as unknown) as Promise<
    'systematique' | 'aleatoireSensible' | 'aleatoireNonSensible' | undefined
  >;
}
