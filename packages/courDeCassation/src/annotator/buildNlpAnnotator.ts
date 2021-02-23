import { buildAnnotator, annotatorConfigType } from '@label/backend';
import { nlpFetcher } from './fetcher';

export { buildNlpAnnotator };

const nlpAnnotatorConfig: annotatorConfigType = {
  name: 'NLP',
  ...nlpFetcher,
};

function buildNlpAnnotator(settings: string) {
  return buildAnnotator(settings, nlpAnnotatorConfig);
}
