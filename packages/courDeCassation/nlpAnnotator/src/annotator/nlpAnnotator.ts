import { buildAnnotator, annotatorConfigType } from '@label/backend';
import { nlpFetcher } from './fetcher';

export { nlpAnnotator };

const nlpAnnotatorConfig: annotatorConfigType = {
  name: 'NLP',
  ...nlpFetcher,
};

const nlpAnnotator = buildAnnotator(nlpAnnotatorConfig);
