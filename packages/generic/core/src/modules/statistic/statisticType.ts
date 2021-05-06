import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { statisticModel };

export type { statisticType };

const statisticModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'id' },
    addedAnnotationsCount: { kind: 'primitive', content: 'number' },
    annotationsCount: { kind: 'primitive', content: 'number' },
    deletedAnnotationsCount: { kind: 'primitive', content: 'number' },
    documentExternalId: { kind: 'primitive', content: 'string' },
    linkedEntitiesCount: { kind: 'primitive', content: 'number' },
    modifiedAnnotationsCount: { kind: 'primitive', content: 'number' },
    publicationCategory: { kind: 'array', content: { kind: 'primitive', content: 'string' } },
    resizedBiggerAnnotationsCount: { kind: 'primitive', content: 'number' },
    resizedSmallerAnnotationsCount: { kind: 'primitive', content: 'number' },
    source: { kind: 'primitive', content: 'string' },
    treatmentDate: { kind: 'primitive', content: 'number' },
    treatmentDuration: { kind: 'primitive', content: 'number' },
    userId: { kind: 'custom', content: 'id' },
    wordsCount: { kind: 'primitive', content: 'number' },
  },
} as const);

type statisticType = buildType<typeof statisticModel, { id: idType }>;
