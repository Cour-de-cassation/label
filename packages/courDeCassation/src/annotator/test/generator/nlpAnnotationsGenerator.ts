import { random } from 'lodash';
import { generatorType } from '@label/core';
import { nlpAnnotationsType } from '../../fetcher/api';

export { nlpAnnotationsGenerator };

const nlpAnnotationsGenerator: generatorType<nlpAnnotationsType> = {
  generate: ({ entities, checklist } = {}) => ({
    entities: entities ? entities : generateRandomNlpAnnotations(),
    checklist: checklist ? checklist : [],
  }),
};

function generateRandomNlpAnnotations() {
  return [...Array(5).keys()].map(() => generateRandomNlpAnnotation());
}

function generateRandomNlpAnnotation() {
  const start = random(100);
  return {
    text: `TEXT_${Math.random()}`,
    start: start,
    end: start + random(8),
    score: Math.random(),
    label: `LABEL`,
    source: `NLP`,
  };
}
