import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { statisticModel };

export type { statisticType };

const statisticModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    addedAnnotationsCount: {
      kind: 'object',
      content: {
        sensitive: { kind: 'primitive', content: 'number' },
        other: { kind: 'primitive', content: 'number' },
      },
    },
    annotationsCount: { kind: 'primitive', content: 'number' },
    deletedAnnotationsCount: {
      kind: 'object',
      content: {
        anonymised: { kind: 'primitive', content: 'number' },
        other: { kind: 'primitive', content: 'number' },
      },
    },
    documentExternalId: { kind: 'primitive', content: 'string' },
    linkedEntitiesCount: { kind: 'primitive', content: 'number' },
    modifiedAnnotationsCount: {
      kind: 'object',
      content: {
        nonAnonymisedToSensitive: { kind: 'primitive', content: 'number' },
        anonymisedToNonAnonymised: { kind: 'primitive', content: 'number' },
        other: { kind: 'primitive', content: 'number' },
      },
    },
    publicationCategory: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
    resizedBiggerAnnotationsCount: {
      kind: 'object',
      content: {
        sensitive: { kind: 'primitive', content: 'number' },
        other: { kind: 'primitive', content: 'number' },
      },
    },
    resizedSmallerAnnotationsCount: {
      kind: 'object',
      content: {
        anonymised: { kind: 'primitive', content: 'number' },
        other: { kind: 'primitive', content: 'number' },
      },
    },
    source: { kind: 'primitive', content: 'string' },
    treatmentDate: { kind: 'primitive', content: 'number' },
    treatmentsSummary: {
      kind: 'array',
      content: {
        kind: 'object',
        content: {
          userId: { kind: 'custom', content: 'id' },
          treatmentDuration: { kind: 'primitive', content: 'number' },
        },
      },
    },
    wordsCount: { kind: 'primitive', content: 'number' },
  },
} as const);

type statisticType = buildType<typeof statisticModel, { id: idType }>;
