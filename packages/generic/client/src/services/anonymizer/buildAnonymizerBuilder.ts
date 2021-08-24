import { annotationType, buildAnonymizer, documentModule, fetchedDocumentType, settingsType } from '@label/core';
import { clientAnonymizerType } from '../../types';

export { buildAnonymizerBuilder };

export type { anonymizerBuilderType };

type anonymizerBuilderType = {
  get: () => clientAnonymizerType;
};

function buildAnonymizerBuilder({
  annotations,
  document,
  settings,
}: {
  annotations: annotationType[];
  document: fetchedDocumentType;
  settings: settingsType;
}): { anonymizerBuilder: anonymizerBuilderType } {
  return {
    anonymizerBuilder: {
      get,
    },
  };

  function get() {
    const seed = documentModule.lib.computeCaseNumber(document);
    const anonymizer = buildAnonymizer(settings, annotations, seed);
    return anonymizer;
  }
}
