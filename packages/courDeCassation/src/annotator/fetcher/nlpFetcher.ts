import { documentType, settingsType } from '@label/core';
import { nlpApi } from './api';
import { nlpMapper } from './mapper';

export { nlpFetcher };

const nlpFetcher = {
  async fetchAnnotationOfDocument(
    settings: settingsType,
    document: documentType,
  ) {
    const nlpAnnotations = await nlpApi.fetchNlpAnnotations(settings, document);

    return {
      annotations: nlpMapper.mapNlpAnnotationsToAnnotations(nlpAnnotations),
      documentId: document._id,
      report: nlpMapper.mapNlpAnnotationstoReport(nlpAnnotations, document),
    };
  },
};
