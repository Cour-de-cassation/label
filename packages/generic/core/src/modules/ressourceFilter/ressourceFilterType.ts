import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { ressourceFilterModel };

export type { ressourceFilterType };

const ressourceFilterModel = buildModel({
  kind: 'object',
  content: {
    mustHaveAddedAnnotations: { kind: 'primitive', content: 'boolean' },
    mustHaveDeletedAnnotations: { kind: 'primitive', content: 'boolean' },
    mustHaveModifiedAnnotations: { kind: 'primitive', content: 'boolean' },
    mustHaveNoModifications: { kind: 'primitive', content: 'boolean' },
    mustHaveResizedBiggerAnnotations: { kind: 'primitive', content: 'boolean' },
    mustHaveResizedSmallerAnnotations: { kind: 'primitive', content: 'boolean' },
    publicationCategory: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    startDate: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'number' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    endDate: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'number' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    source: {
      kind: 'or',
      content: [
        { kind: 'primitive', content: 'string' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
    userId: {
      kind: 'or',
      content: [
        { kind: 'custom', content: 'id' },
        { kind: 'primitive', content: 'undefined' },
      ],
    },
  },
} as const);

type ressourceFilterType = buildType<typeof ressourceFilterModel, { id: idType }>;
