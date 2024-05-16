import { buildAnnotator, annotatorConfigType } from '@label/backend';
import { settingsType } from '@label/core';
import { buildNlpFetcher } from './fetcher';

export { buildNlpAnnotator };

function buildNlpAnnotator(settings: settingsType) {
  const nlpApiBaseUrl = process.env.NLP_PSEUDONYMISATION_API_URL;
  const nlpAnnotatorConfig: annotatorConfigType = {
    name: 'NLP',
    ...buildNlpFetcher(nlpApiBaseUrl),
  };

  return buildAnnotator(settings, nlpAnnotatorConfig);
}
