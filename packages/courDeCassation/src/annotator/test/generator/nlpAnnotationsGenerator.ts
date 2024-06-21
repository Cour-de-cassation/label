import { random } from 'lodash';
import { generatorType } from '@label/core';
import { nlpResponseType } from '../../fetcher/api';

export { nlpAnnotationsGenerator };

const nlpAnnotationsGenerator: generatorType<nlpResponseType> = {
  generate: ({ entities, checklist, versions } = {}) => ({
    entities: entities ? entities : generateRandomNlpAnnotations(),
    checklist: checklist ? checklist : [],
    versions: versions ? versions : generateRandomNlpVersion(),
  }),
};

function generateRandomNlpAnnotations() {
  return [...Array(5).keys()].map(() => generateRandomNlpAnnotation());
}

function generateRandomNlpAnnotation() {
  const start = random(100);
  const text = `TEXT_${Math.random()}`;
  const entity = {
    text: text,
    start: start,
    end: start + random(8),
    score: Math.random(),
    label: `LABEL`,
    source: `NLP`,
    entityId: `LABEL_${text.toLowerCase()}`,
  };
  return entity;
}

function generateRandomNlpVersion() {
  const nlpVersion = {
    juriSpacyTokenizer: {
      version: `VERSION_${Math.random()}`,
      date: `DATE_${Math.random()}`,
    },
    juritools: {
      version: `VERSION_${Math.random()}`,
      date: `DATE_${Math.random()}`,
    },
    pseudonymisationApi: {
      version: `VERSION_${Math.random()}`,
      date: `DATE_${Math.random()}`,
    },
    model: {
      name: `MODEL_${Math.random()}`,
    },
  };
  return nlpVersion;
}
