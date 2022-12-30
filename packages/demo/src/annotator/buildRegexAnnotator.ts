import { buildAnnotator, annotatorConfigType } from '@label/backend';
import { settingsType } from '@label/core';
import { buildRegexFetcher } from './fetcher';

export { buildRegexAnnotator };

function buildRegexAnnotator(settings: settingsType) {
  const regexAnnotatorConfig: annotatorConfigType = {
    name: 'Regex',
    ...buildRegexFetcher(settings),
  };

  return buildAnnotator(settings, regexAnnotatorConfig);
}
