import { buildAnnotator, annotatorConfigType } from '@label/backend';
import { environmentType, settingsType } from '@label/core';
import { buildNlpFetcher } from './fetcher';

export { buildNlpAnnotator };

function buildNlpAnnotator(
  settings: settingsType,
  environment: environmentType,
) {
  const nlpApiBaseUrl = `${environment.pathName.nlpApi}:${environment.port.nlpApi}`;
  const nlpAnnotatorConfig: annotatorConfigType = {
    name: 'NLP',
    ...buildNlpFetcher(nlpApiBaseUrl),
  };

  return buildAnnotator(settings, nlpAnnotatorConfig);
}
