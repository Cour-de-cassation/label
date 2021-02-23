import { random } from 'lodash';
import { generatorType } from '@label/core';
import { nlpAnnotationsType } from '../../fetcher/api';

export { nlpAnnotationsGenerator };

const nlpAnnotationsGenerator: generatorType<nlpAnnotationsType> = {
  generate: ({ entities, check_needed, checklist } = {}) => ({
    entities: entities ? entities : generateRandomNlpAnnotations(),
    check_needed: check_needed
      ? check_needed
      : checklist
      ? !!checklist.length
      : false,
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
    label: `LABEL`,
    source: `NLP`,
  };
}
