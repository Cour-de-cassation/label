import { buildAnnotator, annotatorConfigType } from '@label/backend';
import { settingsType } from '@label/core';
import { nlpFetcher } from './fetcher';

export { buildNlpAnnotator };

const nlpAnnotatorConfig: annotatorConfigType = {
  name: 'NLP',
  ...nlpFetcher,
};

function buildNlpAnnotator(settings: settingsType) {
  return buildAnnotator(settings, nlpAnnotatorConfig);
}
