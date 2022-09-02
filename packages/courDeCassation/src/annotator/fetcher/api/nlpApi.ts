import axios from 'axios';
import { settingsModule } from '@label/core';
import { nlpApiType, nlpAnnotationsType, nlpLossType } from './nlpApiType';

export { buildNlpApi };

type nlpRequestParametersType = {
  idDocument: number;
  text: string;
  source?: string;
  meta?: Array<any>;
  categories?: string[];
};

function buildNlpApi(nlpApiBaseUrl: string): nlpApiType {
  return {
    async fetchNlpAnnotations(settings, document) {
      const filteredSettings = settingsModule.lib.computeFilteredSettings(
        settings,
        document.decisionMetadata.categoriesToOmit,
        document.decisionMetadata.additionalTermsToAnnotate,
      );
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
        url: `${nlpApiBaseUrl}/ner`,
      });

      return response.data as nlpAnnotationsType;
    },
    async fetchNlpLoss(document, treatments) {
      try {
        const response = await axios({
          data: { document, treatments },
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
          url: `${nlpApiBaseUrl}/loss`,
        });
        return response.data as nlpLossType;
      } catch (error) {
        console.error(error);
        console.log(`${nlpApiBaseUrl}/loss`);
      }

      return 0;
    },
  };
}
