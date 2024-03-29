import { random } from 'lodash';
import { generatorType } from '@label/core';
import { nlpResponseType } from '../../fetcher/api';

export { nlpAnnotationsGenerator };

const nlpAnnotationsGenerator: generatorType<nlpResponseType> = {
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
