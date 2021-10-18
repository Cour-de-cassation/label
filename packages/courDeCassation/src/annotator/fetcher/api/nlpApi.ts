import axios from 'axios';
import { settingsModule } from '@label/core';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';
import { logger } from '@label/backend';

export { nlpApi };

const NLP_API_BASE_URL = 'http://127.0.0.1:8081';

type nlpRequestParametersType = {
  idDocument: number;
  text: string;
  source?: string;
  meta?: Array<any>;
  categories?: string[];
};

const nlpApi: nlpApiType = {
  async fetchNlpAnnotations(settings, document) {
    const filteredSettings = settingsModule.lib.computeFilteredSettings(
      settings,
      document.decisionMetadata.categoriesToOmit,
      document.decisionMetadata.additionalTermsToAnnotate,
    );
    logger.log('document.decisionMetadata.parties');
    logger.log(document.decisionMetadata.parties);

    const nlpCategories = settingsModule.lib.getCategories(filteredSettings, {
      status: ['visible', 'alwaysVisible', 'annotable'],
      canBeAnnotatedBy: 'NLP',
    });
    const nlpRequestParameters: nlpRequestParametersType = {
      idDocument: document.documentNumber,
      text: document.text,
      source: document.source,
      meta: document.decisionMetadata.parties,
      categories: nlpCategories,
    };

    const response = await axios({
      data: nlpRequestParameters,
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: `${NLP_API_BASE_URL}/ner`,
    });

    return response.data as nlpAnnotationsType;
  },
};
