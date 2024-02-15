import axios, { AxiosError, AxiosResponse } from 'axios';
import { idModule, settingsModule } from '@label/core';
import { nlpApiType, nlpResponseType, nlpLossType } from './nlpApiType';
import { logger } from '@label/backend';

export { buildNlpApi };

type nlpRequestParametersType = {
  idLabel: string;
  idDecision: string;
  sourceId: number;
  sourceName: string;
  text: string;
  parties?: Array<any>;
  categories?: string[];
  additionalTerms?: string;
};

function buildNlpApi(nlpApiBaseUrl: string): nlpApiType {
  return {
    async fetchNlpAnnotations(settings, document) {
      const filteredSettings = settingsModule.lib.computeFilteredSettings(
        settings,
        document.decisionMetadata.categoriesToOmit,
        document.decisionMetadata.additionalTermsToAnnotate,
        document.decisionMetadata.computedAdditionalTerms,
        document.decisionMetadata.additionalTermsParsingFailed,
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
        additionalTerms: document.decisionMetadata.additionalTermsToAnnotate === '' ? undefined : document.decisionMetadata.additionalTermsToAnnotate,
      };

      return await axios({
        data: nlpRequestParameters,
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        url: `${nlpApiBaseUrl}/ner`,
      })
        .then((response: AxiosResponse) => {
          if (response.status != 200) {
            logger.error({
              operationName: 'Call NLP api ner endpoint',
              msg: `${response.status} ${response.statusText}`,
            });
            throw new Error(`${response.status} ${response.statusText}`);
          } else {
            return response.data as nlpResponseType;
          }
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            logger.error({
              operationName: 'Call NLP api ner endpoint',
              msg: `${error.response.status} ${error.response.statusText}`,
            });
            throw new Error(
              `${error.response.status} ${error.response.statusText}`,
            );
          }
          logger.error({
            operationName: 'Call NLP api ner endpoint',
            msg: `${error.code ?? 'Unknown'} on /ner`,
          });
          throw new Error(`${error.code ?? 'Unknown'} on /ner`);
        });
    },
    async fetchNlpLoss(document, treatments) {
      return await axios({
        data: { text: document.text, treatments },
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        url: `${nlpApiBaseUrl}/loss`,
      })
        .then((response: AxiosResponse) => {
          if (response.status != 200) {
            logger.error({
              operationName: 'Call NLP api loss endpoint',
              msg: `${response.status} ${response.statusText}`,
            });
            throw new Error(`${response.status} ${response.statusText}`);
          } else {
            return response.data as nlpLossType;
          }
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            logger.error({
              operationName: 'Call NLP api loss endpoint',
              msg: `${error.response.status} ${error.response.statusText}`,
            });
            throw new Error(
              `${error.response.status} ${error.response.statusText}`,
            );
          }
          logger.error({
            operationName: 'Call NLP api loss endpoint',
            msg: `${error.code ?? 'Unknown'} on /loss`,
          });
          throw new Error(`${error.code ?? 'Unknown'} on /loss`);
        });
    },
  };
}
