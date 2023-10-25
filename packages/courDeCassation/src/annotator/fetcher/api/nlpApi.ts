import axios from 'axios';
import { idModule, settingsModule } from '@label/core';
import { nlpApiType, nlpAnnotationsType, nlpLossType } from './nlpApiType';

export { buildNlpApi };

type nlpRequestParametersType = {
  idLabel: string;
  idDecision: string;
  sourceId: number;
  sourceName: string;
  text: string;
  parties?: Array<any>;
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
        idLabel: idModule.lib.convertToString(document._id),
        idDecision: document.externalId,
        sourceId: document.documentNumber,
        sourceName: document.source,
        text: document.text,
        parties: document.decisionMetadata.parties,
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
      const response = await axios({
        data: { text: document.text, treatments },
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        url: `${nlpApiBaseUrl}/loss`,
      });
      return response.data as nlpLossType;
    },
  };
}
