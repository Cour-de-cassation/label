import { documentType, settingsType } from '@label/core';
import { buildNlpApi } from './api';
import { nlpMapper } from './mapper';
import { LabelTreatment } from 'dbsder-api-types';

export { buildNlpFetcher };

function buildNlpFetcher(nlpApiBaseUrl: string | undefined) {
  if (nlpApiBaseUrl == undefined) {
    throw new Error('You must provide a valid NLP api URL');
  }
  const nlpApi = buildNlpApi(nlpApiBaseUrl);

  return {
    async fetchAnnotationOfDocument(
      settings: settingsType,
      document: documentType,
    ) {
      const nlpAnnotations = await nlpApi.fetchNlpAnnotations(
        settings,
        document,
      );

      return {
        annotations: nlpMapper.mapNlpAnnotationsToAnnotations(
          nlpAnnotations,
          document,
        ),
        documentId: document._id,
        checklist: nlpAnnotations.checklist ?? [],
        newCategoriesToAnnotate: nlpAnnotations.newCategoriesToAnnotate,
        newCategoriesToUnAnnotate: nlpAnnotations.newCategoriesToUnAnnotate,
        computedAdditionalTerms: nlpMapper.mapNlpAdditionalTerms(
          nlpAnnotations,
        ),
        additionalTermsParsingFailed:
          nlpAnnotations.additionalTermsParsingFailed,
        version: nlpAnnotations.versions,
      };
    },
    async fetchLossOfDocument(
      document: documentType,
      treatments: LabelTreatment[],
    ) {
      const nlpLoss = await nlpApi.fetchNlpLoss(document, treatments);

      return nlpLoss;
    },
  };
}
