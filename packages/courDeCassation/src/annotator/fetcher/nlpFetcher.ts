import { labelTreatmentsType } from '@label/backend';
import { documentType, settingsType } from '@label/core';
import { buildNlpApi } from './api';
import { nlpMapper } from './mapper';

export { buildNlpFetcher };

function buildNlpFetcher(nlpApiBaseUrl: string) {
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
