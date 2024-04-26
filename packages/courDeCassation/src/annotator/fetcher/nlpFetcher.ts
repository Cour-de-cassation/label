import { labelTreatmentsType } from '@label/backend';
import { documentType, settingsType } from '@label/core';
import { buildNlpApi } from './api';
import { nlpMapper } from './mapper';

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
        report: nlpMapper.mapNlpAnnotationstoReport(nlpAnnotations, document),
        newCategoriesToOmit: nlpAnnotations.newCategoriesToOmit,
        computedAdditionalTerms: nlpMapper.mapNlpAdditionalTerms(
          nlpAnnotations,
        ),
        additionalTermsParsingFailed:
          nlpAnnotations.additionalTermsParsingFailed,
      };
    },
    async fetchLossOfDocument(
      document: documentType,
      treatments: labelTreatmentsType,
    ) {
      const nlpLoss = await nlpApi.fetchNlpLoss(document, treatments);

      return nlpLoss;
    },
  };
}
